package org.springframework.samples.petclinic.pod;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.samples.petclinic.exceptions.ResourceNotFoundException;
import org.springframework.samples.petclinic.game.Game;
import org.springframework.samples.petclinic.sector.Sector;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(PodController.class)

public class PodRestControllerTests {

        @MockBean
        private PodService podService;

        @Autowired
        private MockMvc mockMvc;

        private Pod pod1;
        private Pod pod2;

        private List<Pod> pods;
        ObjectMapper objectMapper;

        @BeforeEach
        void setUp() {
                MockitoAnnotations.openMocks(this);

                pod1 = new Pod();
                pod1.setId(1);

                pod2 = new Pod();
                pod2.setId(2);

                pods = new ArrayList<Pod>();
                pods.add(pod1);
                pods.add(pod2);

                objectMapper = new ObjectMapper();
        }

        @Test
        @WithMockUser(username = "player2", password = "0wn3r")
        void canGetAllPods() throws Exception {

                when(podService.getAllPods()).thenReturn(pods);

                MockHttpServletRequestBuilder requestBuilder = get("/api/v1/pods").with(csrf());

                MvcResult result = mockMvc.perform(requestBuilder)
                                .andExpect(status().isOk())
                                .andReturn();

                String responseBody = result.getResponse().getContentAsString();
                List<Pod> ActualPods = objectMapper.readValue(responseBody, List.class);

                assertEquals(pods.size(), ActualPods.size());

        }

        @Test
        @WithMockUser(username = "player2", password = "0wn3r")
        void canCreatePod() throws Exception {

                Game game = new Game();
                Sector sector = new Sector();
                Pod pod = new Pod();
                pod.setId(1);
                pod.setCapacity(1);
                pod.setNumber(1);
                pod.setGame(game);
                pod.setSector(sector);

                objectMapper = new ObjectMapper();
                when(podService.save(any(Pod.class))).thenAnswer(i -> i.getArguments()[0]);
                String json = objectMapper.writeValueAsString(pod);

                MockHttpServletRequestBuilder requestBuilder = post("/api/v1/pods")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json)
                                .with(csrf());

                MvcResult result = mockMvc.perform(requestBuilder)
                                .andExpect(status().isCreated())
                                .andReturn();

                String responseBody = result.getResponse().getContentAsString();
                Pod ActualPod = objectMapper.readValue(responseBody, Pod.class);

                assertEquals(pod.getId(), ActualPod.getId());

        }

        @Test
        @WithMockUser("PLAYER")
        void cantCreatePod_BadRequest() throws Exception {

                Pod pod = new Pod();
                pod.setId(-1);
                pod.setCapacity(1);
                pod.setNumber(1);
                pod.setGame(null);
                pod.setSector(null);

                objectMapper = new ObjectMapper();

                when(podService.save(any(Pod.class))).thenAnswer(i -> i.getArguments()[0]);
                String json = objectMapper.writeValueAsString(pod);

                MockHttpServletRequestBuilder requestBuilder = post("/api/v1/pods")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json)
                                .with(csrf());
                MvcResult result = mockMvc.perform(requestBuilder)
                                .andExpect(status().isBadRequest())
                                .andReturn();
                Integer actualStatus = result.getResponse().getStatus();
                assertEquals(400, actualStatus);

        }

        @Test
        @WithMockUser("PLAYER")
        void canDeletePod() throws Exception {

                Integer pod1Id = 1;

                ObjectMapper objectMapper = new ObjectMapper();

                when(podService.getPodsById(pod1Id)).thenReturn(Optional.of(pod1));
                doNothing().when(podService).delete(pod1Id);

                String json = objectMapper.writeValueAsString(pod1);

                MockHttpServletRequestBuilder requestBuilder = delete("/api/v1/pods/{id}", pod1Id)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json)
                                .with(csrf());
                mockMvc.perform(requestBuilder)
                                .andExpect(status().isNoContent());

        }

        @Test
        @WithMockUser("PLAYER")
        void cantDeletePod_NotFound() throws Exception {

                Integer pod1Id = 1;
                Integer nonExistendPodId = 33;

                ObjectMapper objectMapper = new ObjectMapper();

                when(podService.getPodsById(nonExistendPodId)).thenThrow(ResourceNotFoundException.class);
                doNothing().when(podService).delete(pod1Id);

                String json = objectMapper.writeValueAsString(pod1);

                MockHttpServletRequestBuilder requestBuilder = delete("/api/v1/pods/{id}", pod1Id)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json)
                                .with(csrf());

                mockMvc.perform(requestBuilder).andExpect(status().isNotFound());
        }

        @Test
        @WithMockUser("PLAYER")
        void canDeleteLineByGameId() throws Exception {
                Integer gameId = 1;
                Game game1 = new Game();
                game1.setId(gameId);

                Pod lineTest = new Pod();
                lineTest.setId(3);
                lineTest.setGame(game1);

                when(podService.getPodsByGameId(gameId)).thenReturn(List.of(lineTest));
                doNothing().when(podService).deleteByGameId(gameId);

                MockHttpServletRequestBuilder requestBuilder = delete("/api/v1/pods?gameid={gameId}", gameId)
                                .contentType(MediaType.APPLICATION_JSON)
                                .with(csrf());

                mockMvc.perform(requestBuilder)
                                .andExpect(status().isNoContent());
        }

        @Test
        @WithMockUser("PLAYER")
        void cantDeletePodByGameId() throws Exception {

                Integer nonExistendPodId = 33;

                when(podService.getPodsByGameId(nonExistendPodId)).thenReturn(List.of());
                doNothing().when(podService).deleteByGameId(nonExistendPodId);

                MockHttpServletRequestBuilder requestBuilder = delete("/api/v1/pods?gameid={nonExistendGameId}", nonExistendPodId)
                                .contentType(MediaType.APPLICATION_JSON)
                                .with(csrf());

                mockMvc.perform(requestBuilder)
                                .andExpect(status().isNotFound());
        }

}
