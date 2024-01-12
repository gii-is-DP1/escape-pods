package org.springframework.samples.petclinic.beacon;

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
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.samples.petclinic.exceptions.ResourceNotFoundException;
import org.springframework.samples.petclinic.game.Game;
import org.springframework.samples.petclinic.gameplayer.Color;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(BeaconRestController.class)
public class BeaconRestControllerTests {

        @MockBean
        private BeaconService beaconService;

        @Autowired
        private MockMvc mockMvc;

        private Beacon beacon1;
        private Beacon beacon2;

        private List<Beacon> beacons;
        ObjectMapper objectMapper = new ObjectMapper();

        @BeforeEach
        void setUp() {
                MockitoAnnotations.openMocks(this);

                beacon1 = new Beacon();
                beacon1.setId(1);

                beacon2 = new Beacon();
                beacon2.setId(2);

                beacons = new ArrayList<Beacon>();
                beacons.add(beacon1);
                beacons.add(beacon2);

                objectMapper = new ObjectMapper();
        }

        @Test
        @WithMockUser(username = "player2", password = "0wn3r")
        void canGetAllBeacons() throws Exception {

                when(beaconService.getAllBeacons()).thenReturn(beacons);

                MockHttpServletRequestBuilder requestBuilder = get("/api/v1/beacons")
                                .with(csrf());

                MvcResult result = mockMvc.perform(requestBuilder)
                                .andExpect(status().isOk())
                                .andReturn();

                String responseBody = result.getResponse().getContentAsString();
                List<Beacon> ActualBeacons = objectMapper.readValue(responseBody, List.class);

                assertEquals(beacons.size(), ActualBeacons.size());
        }

        @Test
        @WithMockUser(username = "player2", password = "0wn3r")
        void canCreateBeacon() throws Exception {

                Game game = new Game();
                Beacon beacon = new Beacon();
                beacon.setId(1);
                beacon.setColor1(Color.BLACK);
                beacon.setColor2(Color.WHITE);
                beacon.setGame(game);

                objectMapper = new ObjectMapper();
                when(beaconService.save(any(Beacon.class))).thenAnswer(i -> i.getArguments()[0]);
                String json = objectMapper.writeValueAsString(beacon);

                MockHttpServletRequestBuilder requestBuilder = post("/api/v1/beacons")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json)
                                .with(csrf());
                MvcResult result = mockMvc.perform(requestBuilder)
                                .andExpect(status().isCreated())
                                .andReturn();

                String responseBody = result.getResponse().getContentAsString();
                Beacon ActualBeacon = objectMapper.readValue(responseBody, Beacon.class);

                assertTrue(1 == ActualBeacon.getId());
        }

        @Test
        @WithMockUser("PLAYER")
        void cantCreateBeacon_BadRequest() throws Exception {

                // con datos incorrectos
                Beacon beacon = new Beacon();
                beacon.setId(-1);
                beacon.setColor1(Color.BLACK);
                beacon.setColor2(Color.WHITE);
                beacon.setGame(null);

                objectMapper = new ObjectMapper();

                when(beaconService.save(any(Beacon.class))).thenAnswer(i -> i.getArguments()[0]);
                String json = objectMapper.writeValueAsString(beacon);

                MockHttpServletRequestBuilder requestBuilder = post("/api/v1/beacons")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json)
                                .with(csrf());
                MvcResult result = mockMvc.perform(requestBuilder)
                                .andExpect(status().isBadRequest())
                                .andReturn();
                Integer actualStatus = result.getResponse().getStatus();
                assertTrue(400 == actualStatus);
        }

        // Debido a que los beacons son una entidad fija, estos no cambian, por lo que no se puede testear su modificación.

        @Test
        @WithMockUser("PLAYER")
        void canDeleteBeacon() throws Exception {
                Integer beacon1Id = 1;

                ObjectMapper objectMapper = new ObjectMapper();

                when(beaconService.getBeaconById(beacon1Id)).thenReturn(Optional.of(beacon1));
                doNothing().when(beaconService).delete(beacon1Id);

                String json = objectMapper.writeValueAsString(beacon1);

                MockHttpServletRequestBuilder requestBuilder = delete("/api/v1/beacons/{id}", beacon1Id)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json)
                                .with(csrf());
                mockMvc.perform(requestBuilder)
                                .andExpect(status().isNoContent());

        }

        @Test
        @WithMockUser("PLAYER")
        void cantDeleteBeacon_NotFound() throws Exception {
                Integer beacon1Id = 1;
                Integer nonExistendBeaconId = 33;

                ObjectMapper objectMapper = new ObjectMapper();

                when(beaconService.getBeaconById(nonExistendBeaconId)).thenThrow(ResourceNotFoundException.class);
                doNothing().when(beaconService).delete(beacon1Id);

                String json = objectMapper.writeValueAsString(beacon1);

                MockHttpServletRequestBuilder requestBuilder = delete("/api/v1/beacons/{id}", beacon1Id)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json)
                                .with(csrf());

                mockMvc.perform(requestBuilder)
                                .andExpect(status().isNotFound());

        }
}
