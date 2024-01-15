package org.springframework.samples.petclinic.crewmate;

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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.samples.petclinic.exceptions.ResourceNotFoundException;
import org.springframework.samples.petclinic.game.Game;
import org.springframework.samples.petclinic.gameplayer.Color;
import org.springframework.samples.petclinic.gameplayer.GamePlayer;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(CrewmateRestController.class)
public class CrewmateRestControllerTests {

        @MockBean
        private CrewmateService crewmateService;

        @Autowired
        private MockMvc mockMvc;

        private Crewmate crewmate1;
        private Crewmate crewmate2;

        private List<Crewmate> crewmates;

        ObjectMapper objectMapper = new ObjectMapper();

        @BeforeEach
        void setUp() {
                MockitoAnnotations.openMocks(this);

                crewmate1 = new Crewmate();
                crewmate1.setId(1);

                crewmate2 = new Crewmate();
                crewmate2.setId(2);

                crewmates = new ArrayList<Crewmate>();
                crewmates.add(crewmate1);
                crewmates.add(crewmate2);

                objectMapper = new ObjectMapper();
        }

        @Test
        @WithMockUser(username = "player2", password = "0wn3r")
        void canGetAllCrewmates() throws Exception {

                when(crewmateService.getAllCrewmates()).thenReturn(crewmates);

                MockHttpServletRequestBuilder requestBuilder = get("/api/v1/crewmates")
                                .with(csrf());

                MvcResult result = mockMvc.perform(requestBuilder)
                                .andExpect(status().isOk())
                                .andReturn();

                String responseBody = result.getResponse().getContentAsString();
                List<Crewmate> ActualCrewmates = objectMapper.readValue(responseBody, List.class);

                assertEquals(crewmates.size(), ActualCrewmates.size());
        }

        @Test
        @WithMockUser(username = "player2", password = "0wn3r")
        void canGetCrewmateById() throws Exception {
                Integer crewmate1Id = 1;
                when(crewmateService.getCrewmateById(crewmate1Id)).thenReturn(Optional.of(crewmate1));

                MockHttpServletRequestBuilder requestBuilder = get("/api/v1/crewmates/{id}", crewmate1Id)
                                .with(csrf());

                mockMvc.perform(requestBuilder)
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.id").value(crewmate1Id));

        }

        @Test
        @WithMockUser(username = "player2", password = "0wn3r")
        void cantCrewmateById_NotFound() throws Exception {

                Integer nonExistentCrewmateId = 12;

                when(crewmateService.getCrewmateById(nonExistentCrewmateId)).thenThrow(ResourceNotFoundException.class);

                MockHttpServletRequestBuilder requestBuilder = get("/api/v1/crewmates/{id}", nonExistentCrewmateId)
                                .with(csrf());

                mockMvc.perform(requestBuilder)
                                .andExpect(status().isNotFound());

        }

        @Test
        @WithMockUser(username = "player2", password = "0wn3r")
        void canCreateCrewmate() throws Exception {

                Game game = new Game();
                GamePlayer gameplayer = new GamePlayer();
                Crewmate crewmate = new Crewmate();
                crewmate.setId(1);
                crewmate.setColor(Color.BLACK);
                crewmate.setRole(Role.CAPTAIN);
                crewmate.setArrivalOrder(1);
                crewmate.setPlayer(gameplayer);
                crewmate.setGame(game);

                objectMapper = new ObjectMapper();
                when(crewmateService.save(any(Crewmate.class))).thenAnswer(i -> i.getArguments()[0]);
                String json = objectMapper.writeValueAsString(crewmate);

                MockHttpServletRequestBuilder requestBuilder = post("/api/v1/crewmates")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json)
                                .with(csrf());

                MvcResult result = mockMvc.perform(requestBuilder)
                                .andExpect(status().isCreated())
                                .andReturn();

                String responseBody = result.getResponse().getContentAsString();
                Crewmate ActualCrewmate = objectMapper.readValue(responseBody, Crewmate.class);

                assertTrue(1 == ActualCrewmate.getId());
        }

        @Test
        @WithMockUser("PLAYER")
        void cantCreateCrewmate_BadRequest() throws Exception {

                // con datos incorrectos
                Crewmate crewmate = new Crewmate();
                crewmate.setId(-1);
                crewmate.setColor(Color.BLACK);
                crewmate.setRole(Role.CAPTAIN);
                crewmate.setArrivalOrder(1);
                crewmate.setPlayer(null);
                crewmate.setGame(null);

                objectMapper = new ObjectMapper();

                when(crewmateService.save(any(Crewmate.class))).thenAnswer(i -> i.getArguments()[0]);
                String json = objectMapper.writeValueAsString(crewmate);

                MockHttpServletRequestBuilder requestBuilder = post("/api/v1/crewmates")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json)
                                .with(csrf());

                MvcResult result = mockMvc.perform(requestBuilder)
                                .andExpect(status().isBadRequest())
                                .andReturn();

                Integer actualStatus = result.getResponse().getStatus();
                assertTrue(400 == actualStatus);
        }

        // Debido a que los crewmates son una entidad fija, estos no cambian, por lo que
        // no se puede testear su modificación.

        @Test
        @WithMockUser("PLAYER")
        void canDeleteCrewmate() throws Exception {
                Integer crewmate1Id = 1;

                ObjectMapper objectMapper = new ObjectMapper();

                when(crewmateService.getCrewmateById(crewmate1Id)).thenReturn(Optional.of(crewmate1));
                doNothing().when(crewmateService).deleteById(crewmate1Id);

                String json = objectMapper.writeValueAsString(crewmate1);

                MockHttpServletRequestBuilder requestBuilder = delete("/api/v1/crewmates/{id}", crewmate1Id)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json)
                                .with(csrf());

                mockMvc.perform(requestBuilder)
                                .andExpect(status().isNoContent());
        }

        @Test
        @WithMockUser("PLAYER")
        void cantDeleteCrewmate_NotFound() throws Exception {
                Integer crewmate1Id = 1;
                Integer nonExistendCrewmateId = 33;

                ObjectMapper objectMapper = new ObjectMapper();

                when(crewmateService.getCrewmateById(nonExistendCrewmateId)).thenThrow(ResourceNotFoundException.class);
                doNothing().when(crewmateService).deleteById(crewmate1Id);

                String json = objectMapper.writeValueAsString(crewmate1);

                MockHttpServletRequestBuilder requestBuilder = delete("/api/v1/crewmates/{id}", crewmate1Id)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json)
                                .with(csrf());

                mockMvc.perform(requestBuilder)
                                .andExpect(status().isNotFound());
        }

        @Test
        @WithMockUser("PLAYER")
        void canDeleteCrewmateByGameId() throws Exception {
                Integer gameId = 1;
                Game game1 = new Game();
                game1.setId(gameId);

                Crewmate crewmateTest = new Crewmate();
                crewmateTest.setId(3);
                crewmateTest.setGame(game1);

                when(crewmateService.getAllCrewmatesByGameId(gameId)).thenReturn(List.of(crewmateTest));
                doNothing().when(crewmateService).deleteByGameId(gameId);


                MockHttpServletRequestBuilder requestBuilder = delete("/api/v1/crewmates?gameid={gameId}", gameId)
                                .contentType(MediaType.APPLICATION_JSON)
                                .with(csrf());

                mockMvc.perform(requestBuilder)
                                .andExpect(status().isNoContent());
        }

        @Test
        @WithMockUser("PLAYER")
        void cantDeleteCrewmateByGameId() throws Exception {

                Integer nonExistendCrewmateId = 33;

                when(crewmateService.getAllCrewmatesByGameId(nonExistendCrewmateId)).thenReturn(List.of());
                doNothing().when(crewmateService).deleteByGameId(nonExistendCrewmateId);

                MockHttpServletRequestBuilder requestBuilder = delete("/api/v1/crewmates?gameid={nonExistendGameId}", nonExistendCrewmateId)
                                .contentType(MediaType.APPLICATION_JSON)
                                .with(csrf());

                mockMvc.perform(requestBuilder)
                                .andExpect(status().isNotFound());
        }
}
