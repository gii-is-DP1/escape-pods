package org.springframework.samples.petclinic.game;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.samples.petclinic.exceptions.ResourceNotFoundException;
import org.springframework.samples.petclinic.player.Player;
import org.springframework.samples.petclinic.player.PlayerService;
import org.springframework.samples.petclinic.user.User;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@WebMvcTest(GameRestController.class)
public class GameRestControllerTests {

    @MockBean
    private GameService gameService;

    @MockBean
    private PlayerService payerService;

    @Autowired
    private GameRestController gameRestController;

    @Autowired
    private MockMvc mockMvc;

    private User user1;
    private User user2;

    private Player player1;
    private Player player2;

    private Game game1;
    private Game game2;

    private List<Game> games = new ArrayList<Game>();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        user1 = new User();
        user1.setId(1);
        user2 = new User();
        user2.setId(1);

        player1 = new Player();
        player1.setUser(user1);
        player2 = new Player();
        player2.setUser(user2);

        List<Player> players = List.of(player1, player2);
        List<Player> playersGame2 = List.of(player2, player1);

        game1 = new Game();
        game1.setId(1);
        game1.setPlayers(players);
        game1.setNumPlayers(3);
        game1.setStart(LocalDateTime.of(2024, 1, 3, 11, 23));
        game1.setStatus(GameStatus.WAITING);

        game2 = new Game();
        game2.setId(2);
        game2.setPlayers(playersGame2);
        game2.setNumPlayers(2);
        game2.setStart(LocalDateTime.of(2023, 12, 15, 9, 23));
        game2.setFinish(LocalDateTime.of(2023, 12, 15, 10, 5));
        game2.setStatus(GameStatus.FINISHED);

        games.add(game1);
        games.add(game2);

    }

    @Test
    void canGetAllGames() {
        List<Game> expectedGames = games;

        when(gameService.getAllGames(any(Pageable.class))).thenReturn(expectedGames);

        ResponseEntity<List<Game>> actualResponse = gameRestController.getAllGames(null, null, null, 1, 10);

        assertEquals(HttpStatus.OK, actualResponse.getStatusCode());
        assertEquals(2, actualResponse.getBody().size());
        assertTrue(1 == actualResponse.getBody().get(0).getId());
    }

    @Test
    @WithMockUser(username = "player2", password = "0wn3r")
    void canCreateGame() throws Exception {

        List<Player> playersGame3 = List.of(player2);

        // arrange del game con los datos validos
        Game game3 = new Game();
        game3.setId(3);
        game3.setPlayers(playersGame3);
        game3.setNumPlayers(2);
        game3.setStatus(GameStatus.WAITING);

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        when(gameService.save(any(Game.class))).thenAnswer(i -> i.getArguments()[0]);
        String game3JsonString = objectMapper.writeValueAsString(game3);

        MockHttpServletRequestBuilder requestBuilder = post("/api/v1/games")
                .contentType(MediaType.APPLICATION_JSON)
                .content(game3JsonString)
                .with(csrf());

        MvcResult result = mockMvc.perform(requestBuilder)
                .andExpect(status().isCreated())
                .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        Game createdGame = objectMapper.readValue(responseBody, Game.class);

        assertTrue(3 == createdGame.getId());

    }

    @Test
    @WithMockUser(username = "nonPlayer1", password = "0wn3r")
    void cantCreateGame_forbidden() throws Exception {

        List<Player> playersGame3 = List.of(player2);

        // arrange del game con los datos validos
        Game game3 = new Game();
        game3.setId(3);
        game3.setPlayers(playersGame3);
        game3.setNumPlayers(2);
        game3.setStatus(GameStatus.WAITING);

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        when(gameService.save(any(Game.class))).thenAnswer(i -> i.getArguments()[0]);
        String game3JsonString = objectMapper.writeValueAsString(game3);

        // no se establece el uso de jwt lo que nos permite comprobar ele rror que
        // queremos, la ruta no permitida
        MockHttpServletRequestBuilder requestBuilder = post("/api/v1/games")
                .contentType(MediaType.APPLICATION_JSON)
                .content(game3JsonString);

        MvcResult result = mockMvc.perform(requestBuilder)
                .andExpect(status().isForbidden())
                .andReturn();

        Integer actualStatus = result.getResponse().getStatus();
        assertFalse(201 == actualStatus);

    }

    @Test
    @WithMockUser("PLAYER")
    void canCreateGame_BadRequest() throws Exception {

        // arrange del game con datos invalidos
        Game game3 = new Game();
        game3.setId(3);
        game3.setPlayers(null);
        game3.setNumPlayers(6);
        game3.setStatus(null);

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        when(gameService.save(any(Game.class))).thenAnswer(i -> i.getArguments()[0]);
        String game3JsonString = objectMapper.writeValueAsString(game3);

        MockHttpServletRequestBuilder requestBuilder = post("/api/v1/games")
                .contentType(MediaType.APPLICATION_JSON)
                .content(game3JsonString)
                .with(csrf());

        MvcResult result = mockMvc.perform(requestBuilder)
                .andExpect(status().isBadRequest())
                .andReturn();

        Integer actualStatus = result.getResponse().getStatus();
        assertFalse(201 == actualStatus);

    }

    @Test
    @WithMockUser("PLAYER")
    void canUpdateGame() throws Exception {
        Integer game1Id = 1;

        game1.setStatus(GameStatus.FINISHED);
        game1.setFinish(LocalDateTime.of(2024, 1, 4, 12, 10));

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        when(gameService.getGameById(game1Id)).thenReturn(Optional.of(game1));
        when(gameService.save(game1)).thenReturn(game1);
        String game3JsonString = objectMapper.writeValueAsString(game1);

        MockHttpServletRequestBuilder requestBuilder = put("/api/v1/games/{id}", game1Id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(game3JsonString)
                .with(csrf());

        mockMvc.perform(requestBuilder)
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser("PLAYER")
    void cantUpdateGame_NotFoud() throws Exception {
        Integer nonExistentGameId = 12;

        game1.setStatus(GameStatus.FINISHED);
        game1.setFinish(LocalDateTime.of(2024, 1, 4, 12, 10));

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        when(gameService.getGameById(nonExistentGameId)).thenThrow(ResourceNotFoundException.class);
        when(gameService.save(game1)).thenReturn(game1);
        String game3JsonString = objectMapper.writeValueAsString(game1);

        MockHttpServletRequestBuilder requestBuilder = put("/api/v1/games/{id}", nonExistentGameId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(game3JsonString)
                .with(csrf());

        mockMvc.perform(requestBuilder)
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser("PLAYER")
    void canDeleteGame() throws Exception {
        Integer game1Id = 1;

        game1.setStatus(GameStatus.FINISHED);
        game1.setFinish(LocalDateTime.of(2024, 1, 4, 12, 10));

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        when(gameService.getGameById(game1Id)).thenReturn(Optional.of(game1));
        doNothing().when(gameService).delete(game1Id);

        String game3JsonString = objectMapper.writeValueAsString(game1);
        MockHttpServletRequestBuilder requestBuilder = delete("/api/v1/games/{id}", game1Id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(game3JsonString)
                .with(csrf());

        mockMvc.perform(requestBuilder)
                .andExpect(status().isNoContent());

    }

    @Test
    @WithMockUser("PLAYER")
    void cantDeleteGame_NotFound() throws Exception {
        Integer game1Id = 1;
        Integer nonExistenGameId  = 12;
 
        game1.setStatus(GameStatus.FINISHED);
        game1.setFinish(LocalDateTime.of(2024, 1, 4, 12, 10));

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        when(gameService.getGameById(nonExistenGameId)).thenThrow(ResourceNotFoundException.class);
        doNothing().when(gameService).delete(game1Id);

        String game3JsonString = objectMapper.writeValueAsString(game1);
        MockHttpServletRequestBuilder requestBuilder = delete("/api/v1/games/{id}", game1Id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(game3JsonString)
                .with(csrf());

        mockMvc.perform(requestBuilder)
                .andExpect(status().isNotFound());

    }

}
