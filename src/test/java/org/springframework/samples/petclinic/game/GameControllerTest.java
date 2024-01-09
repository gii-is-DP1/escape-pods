package org.springframework.samples.petclinic.game;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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
public class GameControllerTest {

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
    @WithMockUser("PLAYER")
    void canCreateGame() throws Exception {

        List<Player> playersGame3 = List.of(player2);

        // arrange del game con los datos validos
        Game game3 = new Game();
        game3.setId(3);
        game3.setPlayers(playersGame3);
        game3.setNumPlayers(2);
        game3.setStart(LocalDateTime.of(2024, 1, 5, 12, 23));
        game3.setStatus(GameStatus.WAITING);

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        when(gameService.save(any(Game.class))).thenAnswer(i -> i.getArguments()[0]);
        String game3JsonString = objectMapper.writeValueAsString(game3);

        MockHttpServletRequestBuilder requestBuilder = post("/api/v1/games")
                .contentType(MediaType.APPLICATION_JSON)
                .content(game3JsonString)
                .with(csrf());

        // comprobamos que el Game creado sea correcto en base a todo lo que hemos
        // declarado
        MvcResult result = mockMvc.perform(requestBuilder)
                .andExpect(status().isCreated())
                .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        Game createdGame = objectMapper.readValue(responseBody, Game.class);

        assertTrue(3 == createdGame.getId());

    }

}
