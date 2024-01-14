package org.springframework.samples.petclinic.slotInfo;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.samples.petclinic.crewmate.Role;
import org.springframework.samples.petclinic.exceptions.ResourceNotFoundException;
import org.springframework.samples.petclinic.game.Game;
import org.springframework.samples.petclinic.shelterCard.ShelterCard;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(SlotInfoController.class)
public class SlotInfoRestControllerTests {

        @MockBean
        private SlotInfoService slotInfoService;

        @Autowired
        private MockMvc mockMvc;

        private SlotInfo slotInfo1;
        private SlotInfo slotInfo2;

        private List<SlotInfo> slotInfos;
        ObjectMapper objectMapper = new ObjectMapper();

        @BeforeEach
        void setUp() {
                MockitoAnnotations.openMocks(this);

                slotInfo1 = new SlotInfo();
                slotInfo1.setId(1);

                slotInfo2 = new SlotInfo();
                slotInfo2.setId(2);

                slotInfos = new ArrayList<SlotInfo>();
                slotInfos.add(slotInfo1);
                slotInfos.add(slotInfo2);

                objectMapper = new ObjectMapper();
        }

        @Test
        @WithMockUser(username = "player2", password = "0wn3r")
        void canGetAllSlotInfos() throws Exception {

                when(slotInfoService.getAllSlotInfos()).thenReturn(slotInfos);

                MockHttpServletRequestBuilder requestBuilder = get("/api/v1/slotInfos")
                                .with(csrf());

                MvcResult result = mockMvc.perform(requestBuilder)
                                .andExpect(status().isOk())
                                .andReturn();

                String responseBody = result.getResponse().getContentAsString();
                List<SlotInfo> ActualSlotInfos = objectMapper.readValue(responseBody, List.class);

                assertEquals(slotInfos.size(), ActualSlotInfos.size());
        }

        @Test
        @WithMockUser(username = "player2", password = "0wn3r")
        void canGetSlotInfoById() throws Exception {
                Integer slotInfo1Id = 1;
                when(slotInfoService.getSlotInfoById(slotInfo1Id)).thenReturn(Optional.of(slotInfo1));

                MockHttpServletRequestBuilder requestBuilder = get("/api/v1/slotInfos/{id}", slotInfo1Id)
                                .with(csrf());

                mockMvc.perform(requestBuilder)
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.id").value(slotInfo1Id));

        }

        @Test
        @WithMockUser(username = "player2", password = "0wn3r")
        void cantGetSlotInfoById_NotFound() throws Exception {

                Integer nonExistentSlotInfoId = 12;

                when(slotInfoService.getSlotInfoById(nonExistentSlotInfoId)).thenThrow(ResourceNotFoundException.class);

                MockHttpServletRequestBuilder requestBuilder = get("/api/v1/slotInfos/{id}", nonExistentSlotInfoId)
                                .with(csrf());

                mockMvc.perform(requestBuilder)
                                .andExpect(status().isNotFound());

        }

        @Test
        @WithMockUser(username = "player2", password = "0wn3r")
        void canCreateSlotInfo() throws Exception {

                Game game = new Game();
                ShelterCard shelterCard = new ShelterCard();
                SlotInfo slotInfo = new SlotInfo();
                slotInfo.setId(1);
                slotInfo.setPosition(3);
                slotInfo.setRole(Role.CAPTAIN);
                slotInfo.setSlotScore(3);
                slotInfo.setShelter(shelterCard);
                slotInfo.setGame(game);

                objectMapper = new ObjectMapper();
                when(slotInfoService.save(any(SlotInfo.class))).thenAnswer(i -> i.getArguments()[0]);
                String json = objectMapper.writeValueAsString(slotInfo);

                MockHttpServletRequestBuilder requestBuilder = post("/api/v1/slotInfos")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json)
                                .with(csrf());
                MvcResult result = mockMvc.perform(requestBuilder)
                                .andExpect(status().isCreated())
                                .andReturn();

                String responseBody = result.getResponse().getContentAsString();
                SlotInfo ActualSlotInfo = objectMapper.readValue(responseBody, SlotInfo.class);

                assertTrue(1 == ActualSlotInfo.getId());
        }

        @Test
        @WithMockUser("PLAYER")
        void cantCreateSlotInfo_BadRequest() throws Exception {

                // Con datos incorrectos
                SlotInfo slotInfo = new SlotInfo();
                slotInfo.setId(-1);
                slotInfo.setPosition(3);
                slotInfo.setRole(Role.CAPTAIN);
                slotInfo.setSlotScore(3);
                slotInfo.setShelter(null);
                slotInfo.setGame(null);

                objectMapper = new ObjectMapper();

                when(slotInfoService.save(any(SlotInfo.class))).thenAnswer(i -> i.getArguments()[0]);
                String json = objectMapper.writeValueAsString(slotInfo);

                MockHttpServletRequestBuilder requestBuilder = post("/api/v1/slotInfos")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json)
                                .with(csrf());
                MvcResult result = mockMvc.perform(requestBuilder)
                                .andExpect(status().isBadRequest())
                                .andReturn();
                Integer actualStatus = result.getResponse().getStatus();
                assertTrue(400 == actualStatus);
        }

        @Test
        @WithMockUser("PLAYER")
        void canDeleteSlotInfo() throws Exception {
                Integer slotInfo1Id = 1;

                ObjectMapper objectMapper = new ObjectMapper();

                when(slotInfoService.getSlotInfoById(slotInfo1Id)).thenReturn(Optional.of(slotInfo1));
                doNothing().when(slotInfoService).delete(slotInfo1Id);

                String json = objectMapper.writeValueAsString(slotInfo1);

                MockHttpServletRequestBuilder requestBuilder = delete("/api/v1/slotInfos/{id}", slotInfo1Id)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json)
                                .with(csrf());
                mockMvc.perform(requestBuilder)
                                .andExpect(status().isNoContent());

        }

        @Test
        @WithMockUser("PLAYER")
        void cantDeleteSlotInfo_NotFound() throws Exception {
                Integer slotInfo1Id = 1;
                Integer nonExistendSlotInfoId = 33;

                ObjectMapper objectMapper = new ObjectMapper();

                when(slotInfoService.getSlotInfoById(nonExistendSlotInfoId)).thenThrow(ResourceNotFoundException.class);
                doNothing().when(slotInfoService).delete(slotInfo1Id);

                String json = objectMapper.writeValueAsString(slotInfo1);

                MockHttpServletRequestBuilder requestBuilder = delete("/api/v1/slotInfos/{id}", slotInfo1Id)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json)
                                .with(csrf());

                mockMvc.perform(requestBuilder)
                                .andExpect(status().isNotFound());

        }
}
