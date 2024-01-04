package org.springframework.samples.petclinic.game;

import static org.junit.Assert.assertThat;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.http.MediaType;
import org.springframework.samples.petclinic.player.Player;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.transaction.Transactional;

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
public class GameControllerSocialTest {

    @Autowired
    private WebApplicationContext context;

    private MockMvc mockMvc;

    @Autowired
    GameService gs;

    static final Integer TEST_GAME_ID = 20;
    static final String BASE_URL = "/api/v1/games";

    @BeforeEach
    public void setup() {
        Game testGame = new Game();
        testGame.setId(TEST_GAME_ID);
        testGame.setNumPlayers(4);
        testGame.setStatus(GameStatus.WAITING);
        testGame.setStart(LocalDateTime.of(2024, 1, 2, 12, 20));
        List<Integer> exps = List.of(3, 4, 3, 5);
        testGame.setExplosions(exps);
        List<Player> players= null;
        testGame.setPlayers(players);

        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(SecurityMockMvcConfigurers.springSecurity())
                .build();
    }

    

    @Test
    @Transactional
    @WithMockUser(username = "Shigeru", authorities = { "ADMIN" })
    public void feasibleGameCreationTest() throws JsonProcessingException, Exception {

        Game testGame = new Game();
        testGame.setId(TEST_GAME_ID);
        testGame.setNumPlayers(4);
        testGame.setStatus(GameStatus.WAITING);
        testGame.setStart(LocalDateTime.of(2024, 1, 2, 10, 20, 24));
        List<Integer> exps = List.of(3, 4, 3, 5);
        testGame.setExplosions(exps);
        List<Player> players=null;
        testGame.setPlayers(players);

        // Game value= gs.getGameById(g.getId()).get();
        ObjectMapper objectMapper = new ObjectMapper();

        mockMvc.perform(post(BASE_URL)
                .with(csrf()).contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testGame)))
                .andExpect(status().isCreated());

    }

    /*
     * private void assertNotNull(List<Game> gamesByName) {
     * }
     */

}
