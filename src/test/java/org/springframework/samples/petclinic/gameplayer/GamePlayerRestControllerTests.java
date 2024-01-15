package org.springframework.samples.petclinic.gameplayer;

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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.samples.petclinic.exceptions.ResourceNotFoundException;
import org.springframework.samples.petclinic.game.Game;
import org.springframework.samples.petclinic.player.Player;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(GamePlayerRestController.class)
public class GamePlayerRestControllerTests {

        @MockBean
        private GamePlayerService gamePlayerService;

        @Autowired
        private MockMvc mockMvc;

        private GamePlayer gamePlayer1;
        private GamePlayer gamePlayer2;

        private List<GamePlayer> gamePlayers;

        ObjectMapper objectMapper = new ObjectMapper();

        @BeforeEach
        void setUp() {
                MockitoAnnotations.openMocks(this);

                gamePlayer1 = new GamePlayer();
                gamePlayer1.setId(1);
                Player player = new Player();
                Game game = new Game();
                gamePlayer1.setPlayer(player);
                gamePlayer1.setGame(game);
                gamePlayer1.setColor(Color.BLACK);
                gamePlayer1.setActions(2);
                gamePlayer1.setNoMoreTurns(false);

                gamePlayer2 = new GamePlayer();
                gamePlayer2.setId(2);
                Player player2 = new Player();
                Game game2 = new Game();
                gamePlayer2.setPlayer(player2);
                gamePlayer2.setGame(game2);
                gamePlayer2.setColor(Color.WHITE);
                gamePlayer2.setActions(1);
                gamePlayer2.setNoMoreTurns(false);

                gamePlayers = new ArrayList<GamePlayer>();
                gamePlayers.add(gamePlayer1);
                gamePlayers.add(gamePlayer2);
        }

        @Test
        @WithMockUser(username = "player2", password = "0wn3r")
        void getAllGamePlayersTest() throws Exception {

                when(gamePlayerService.getAllGamePlayers()).thenReturn(gamePlayers);

                MockHttpServletRequestBuilder requestBuilder = get("/api/v1/gamePlayers")
                                .with(csrf());

                MvcResult response = mockMvc.perform(requestBuilder)
                                .andExpect(status().isOk())
                                .andReturn();

                String responseBody = response.getResponse().getContentAsString();
                List<GamePlayer> actualGamePlayers = objectMapper.readValue(responseBody, List.class);

                assertEquals(gamePlayers.size(), actualGamePlayers.size());
        }


        @Test
        @WithMockUser(username = "player2", password = "0wn3r")
        void canGetGamePlayerById() throws Exception {
                Integer gamePlayerId = 1;
                when(gamePlayerService.getGamePlayerById(gamePlayerId)).thenReturn(Optional.of(gamePlayer1));

                MockHttpServletRequestBuilder requestBuilder = get("/api/v1/gamePlayers/{id}", gamePlayerId)
                                .with(csrf());

                mockMvc.perform(requestBuilder)
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.id").value(gamePlayerId));

        }

        @Test
        @WithMockUser(username = "player2", password = "0wn3r")
        void canCreateGamePlayer() throws Exception {

                Game game = new Game();
                Player player = new Player();
                GamePlayer gameplayer = new GamePlayer();
                gameplayer.setGame(game);
                gameplayer.setId(1);
                gameplayer.setColor(Color.BLACK);
                gameplayer.setPlayer(player);
                gameplayer.setActions(2);
                gameplayer.setNoMoreTurns(false);

                objectMapper = new ObjectMapper();
                when(gamePlayerService.save(any(GamePlayer.class))).thenAnswer(i -> i.getArguments()[0]);
                String json = objectMapper.writeValueAsString(gameplayer);

                MockHttpServletRequestBuilder requestBuilder = post("/api/v1/gamePlayers")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json)
                                .with(csrf());

                MvcResult result = mockMvc.perform(requestBuilder)
                                .andExpect(status().isCreated())
                                .andReturn();

                String responseBody = result.getResponse().getContentAsString();
                GamePlayer actualGamePlayer = objectMapper.readValue(responseBody, GamePlayer.class);

                assertTrue(1 == actualGamePlayer.getId());
        }


        @Test
        @WithMockUser("PLAYER")
        void cantCreateGamePlayer_BadRequest() throws Exception {

                GamePlayer gameplayer = new GamePlayer();
                gameplayer.setGame(null);
                gameplayer.setId(-1);
                gameplayer.setColor(Color.BLACK);
                gameplayer.setPlayer(null);
                gameplayer.setActions(-2);

                objectMapper = new ObjectMapper();

                when(gamePlayerService.save(any(GamePlayer.class))).thenAnswer(i -> i.getArguments()[0]);
                String json = objectMapper.writeValueAsString(gameplayer);

                MockHttpServletRequestBuilder requestBuilder = post("/api/v1/gamePlayers")
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
        void canUpdateGamePlayer() throws Exception {
                Integer GamePlayer1Id = 1;

                gamePlayer1.setColor(Color.WHITE);

                when(gamePlayerService.getGamePlayerById(GamePlayer1Id)).thenReturn(Optional.of(gamePlayer1));
                when(gamePlayerService.save(gamePlayer1)).thenReturn(gamePlayer1);
                String gamePlayer3JsonString = objectMapper.writeValueAsString(gamePlayer1);

                MockHttpServletRequestBuilder requestBuilder = put("/api/v1/gamePlayers/{id}", GamePlayer1Id)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(gamePlayer3JsonString)
                                .with(csrf());

                mockMvc.perform(requestBuilder)
                                .andExpect(status().isNoContent());
        }

        @Test
        @WithMockUser("PLAYER")
        void cantUpdateGamePlayer_NotFound() throws Exception {
                Integer nonExistentGamePlayerId = 12;

                gamePlayer1.setColor(Color.WHITE);

                when(gamePlayerService.getGamePlayerById(nonExistentGamePlayerId))
                                .thenThrow(ResourceNotFoundException.class);
                when(gamePlayerService.save(gamePlayer1)).thenReturn(gamePlayer1);

                String gamePlayer3JsonString = objectMapper.writeValueAsString(gamePlayer1);

                MockHttpServletRequestBuilder requestBuilder = put("/api/v1/gamePlayers/{id}", nonExistentGamePlayerId)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(gamePlayer3JsonString)
                                .with(csrf());

                mockMvc.perform(requestBuilder)
                                .andExpect(status().isNotFound());
        }

        @Test
        @WithMockUser("PLAYER")
        void canDeleteGamePlayer() throws Exception {
                Integer gamePlayer1Id = 1;

                ObjectMapper objectMapper = new ObjectMapper();

                when(gamePlayerService.getGamePlayerById(gamePlayer1Id)).thenReturn(Optional.of(gamePlayer1));
                doNothing().when(gamePlayerService).delete(gamePlayer1Id);

                String json = objectMapper.writeValueAsString(gamePlayer1);

                MockHttpServletRequestBuilder requestBuilder = delete("/api/v1/gamePlayers/{id}", gamePlayer1Id)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json)
                                .with(csrf());

                mockMvc.perform(requestBuilder)
                                .andExpect(status().isNoContent());
        }

        @Test
        @WithMockUser("PLAYER")
        void cantDeleteGamePlayer_NotFound() throws Exception {
                Integer gamePlayer1Id = 1;
                Integer nonExistendGamePlayerId = 33;

                ObjectMapper objectMapper = new ObjectMapper();

                when(gamePlayerService.getGamePlayerById(nonExistendGamePlayerId))
                                .thenThrow(ResourceNotFoundException.class);
                doNothing().when(gamePlayerService).delete(gamePlayer1Id);

                String json = objectMapper.writeValueAsString(gamePlayer1);

                MockHttpServletRequestBuilder requestBuilder = delete("/api/v1/gamePlayers/{id}", gamePlayer1Id)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json)
                                .with(csrf());

                mockMvc.perform(requestBuilder)
                                .andExpect(status().isNotFound());
        }

        @Test
        @WithMockUser("PLAYER")
        void canDeleteGamePlayerByGameId() throws Exception {
                Integer gameId = 1;
                Game game1 = new Game();
                game1.setId(gameId);

                GamePlayer GamePlayerTest = new GamePlayer();
                GamePlayerTest.setId(3);
                GamePlayerTest.setGame(game1);

                when(gamePlayerService.getGamePlayersByGameId(gameId)).thenReturn(List.of(GamePlayerTest));
                doNothing().when(gamePlayerService).deleteByGameId(gameId);


                MockHttpServletRequestBuilder requestBuilder = delete("/api/v1/gamePlayers?gameid={gameId}", gameId)
                                .contentType(MediaType.APPLICATION_JSON)
                                .with(csrf());

                mockMvc.perform(requestBuilder)
                                .andExpect(status().isNoContent());
        }

        @Test
        @WithMockUser("PLAYER")
        void cantDeleteGamePlayerByGameId() throws Exception {

                Integer nonExistendGamePlayerId = 33;

                when(gamePlayerService.getGamePlayersByGameId(nonExistendGamePlayerId)).thenReturn(List.of());
                doNothing().when(gamePlayerService).deleteByGameId(nonExistendGamePlayerId);

                MockHttpServletRequestBuilder requestBuilder = delete("/api/v1/gamePlayers?gameid={nonExistendGameId}", nonExistendGamePlayerId)
                                .contentType(MediaType.APPLICATION_JSON)
                                .with(csrf());

                mockMvc.perform(requestBuilder)
                                .andExpect(status().isNotFound());
        }
}
