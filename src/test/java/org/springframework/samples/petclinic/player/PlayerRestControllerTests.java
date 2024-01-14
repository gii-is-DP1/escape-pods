package org.springframework.samples.petclinic.player;

import static org.junit.Assert.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.samples.petclinic.beacon.Beacon;
import org.springframework.samples.petclinic.exceptions.ResourceNotFoundException;
import org.springframework.samples.petclinic.user.Authorities;
import org.springframework.samples.petclinic.user.User;
import org.springframework.samples.petclinic.user.UserService;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@WebMvcTest(PlayerRestController.class)
public class PlayerRestControllerTests {

        @MockBean
        private PlayerService playerService;

        @MockBean
        private UserService userService;

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private ObjectMapper objectMapper;

        private User user1;
        private User user2;

        private Player player1;
        private Player player2;

        private List<Player> players = new ArrayList<>();

        @BeforeEach
        void setUp() {
                MockitoAnnotations.openMocks(this);
                objectMapper = new ObjectMapper();
                objectMapper.registerModule(new JavaTimeModule());

                user1 = new User();
                user1.setId(1);
                user1.setUsername("user1");
                user1.setPassword("0wn3r");
                user2 = new User();
                user2.setId(2);
                user2.setUsername("user2");
                user2.setPassword("0wn3r");

                player1 = new Player();
                player1.setId(1);
                player1.setUser(user1);
                player1.setProfileDescription("perfil de player1");
                player1.setProfilePicture("https://metricool.com/wp-content/uploads/PERFIL-TIKTOK-scaled.jpg");

                player2 = new Player();
                player2.setUser(user2);
                player2.setId(2);
                player2.setProfileDescription("jaja");
                player2.setProfilePicture("https://i.kym-cdn.com/photos/images/newsfeed/000/611/069/733.jpg");

                players.add(player1);
                players.add(player2);

        }

        @Test
        @WithMockUser("ADMIN")
        void canGetAllPlayers() throws Exception {
                List<Player> expectedPlayers = players;
                when(playerService.findAll()).thenReturn(expectedPlayers);
                MockHttpServletRequestBuilder requestBuilder = get("/api/v1/players")
                                .with(csrf());

                MvcResult result = mockMvc.perform(requestBuilder)
                                .andExpect(status().isOk())
                                .andReturn();

                String responseBody = result.getResponse().getContentAsString();
                List<Beacon> actualPlayers = objectMapper.readValue(responseBody, List.class);

                assertEquals(expectedPlayers.size(), actualPlayers.size());
        }

        @Test
        @WithMockUser("ADMIN")
        void canGetPlayerById() throws Exception {
                Integer player1Id = 1;
                when(playerService.findPlayerById(player1Id)).thenReturn(player1);

                MockHttpServletRequestBuilder requestBuilder = get("/api/v1/players/{id}", player1Id)
                                .with(csrf());

                mockMvc.perform(requestBuilder)
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.id").value(player1Id));

        }

        @Test
        @WithMockUser("ADMIN")
        void cantGetPlayerById_NotFound() throws Exception {

                Integer nonExistentPlayerId = 12;

                when(playerService.findPlayerById(nonExistentPlayerId)).thenThrow(ResourceNotFoundException.class);

                MockHttpServletRequestBuilder requestBuilder = get("/api/v1/players/{id}", nonExistentPlayerId)
                                .with(csrf());

                mockMvc.perform(requestBuilder)
                                .andExpect(status().isNotFound());

        }

        @Test
        @WithMockUser("ADMIN")
        void canCreatePlayer() throws Exception {

                Authorities playerAuth = new Authorities();
                playerAuth.setId(1);
                playerAuth.setAuthority("PLAYER");

                User user3 = new User();
                user3.setId(3);
                user3.setUsername("user3");
                user3.setPassword("0wn3r");
                user3.setAuthority(playerAuth);

                Player player3 = new Player();
                player3.setId(3);
                player3.setUser(user3);
                player3.setProfileDescription("jajajajaajjajajja");
                player3.setProfilePicture("https://i.kym-cdn.com/photos/images/newsfeed/000/611/069/733.jpg");

                when(playerService.savePlayer(any(Player.class))).thenAnswer(i -> i.getArguments()[0]);
                String json = objectMapper.writeValueAsString(player3);

                MockHttpServletRequestBuilder requestBuilder = post("/api/v1/players")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json)
                                .with(csrf());

                MvcResult result = mockMvc.perform(requestBuilder)
                                .andExpect(status().isCreated())
                                .andReturn();

                String responseBody = result.getResponse().getContentAsString();
                Player createdPlayer = objectMapper.readValue(responseBody, Player.class);

                assertEquals("jajajajaajjajajja", createdPlayer.getProfileDescription());
        }

        @Test
        @WithMockUser("ADMIN")
        void cantCreatePlayer() throws Exception {

                User user3 = new User();
                user3.setId(3);
                user3.setUsername("user3");
                user3.setPassword("0wn3r");

                Player player3 = new Player();
                player3.setId(3);
                player3.setUser(user3);
                player3.setProfileDescription(null);
                player3.setProfilePicture(null);

                when(playerService.savePlayer(any(Player.class))).thenAnswer(i -> i.getArguments()[0]);
                String json = objectMapper.writeValueAsString(player3);

                MockHttpServletRequestBuilder requestBuilder = post("/api/v1/players")
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
        @WithMockUser("ADMIN")
        void cantUpdatePlayer() throws Exception {
                Integer nonExistentplayerId = 1;

                player1.setProfileDescription("ealpdep");

                when(playerService.findPlayerById(nonExistentplayerId)).thenThrow(ResourceNotFoundException.class);
                when(playerService.savePlayer(player1)).thenReturn(player1);
                String player3JsonString = objectMapper.writeValueAsString(player1);

                MockHttpServletRequestBuilder requestBuilder = put("/api/v1/players/{id}", nonExistentplayerId)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(player3JsonString)
                                .with(csrf());

                mockMvc.perform(requestBuilder)
                                .andExpect(status().isNotFound());

        }

        @Test
        @WithMockUser("ADMIN")
        void cantDeletePlayer_NotFound() throws Exception {
                Integer player1Id = 1;
                Integer nonExistendPlayerId = 33;

                ObjectMapper objectMapper = new ObjectMapper();

                when(playerService.findPlayerById(nonExistendPlayerId)).thenThrow(ResourceNotFoundException.class);
                doNothing().when(playerService).deletePlayer(player1Id);

                String json = objectMapper.writeValueAsString(player1);

                MockHttpServletRequestBuilder requestBuilder = delete("/api/v1/players/{id}", player1Id)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json)
                                .with(csrf());

                mockMvc.perform(requestBuilder)
                                .andExpect(status().isNotFound());

        }
}
