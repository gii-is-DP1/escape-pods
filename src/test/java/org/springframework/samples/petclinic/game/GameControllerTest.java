package org.springframework.samples.petclinic.game;


import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.samples.petclinic.player.Player;
import org.springframework.samples.petclinic.player.PlayerService;
import org.springframework.samples.petclinic.user.User;

public class GameControllerTest {

    @Mock
    private GameService gameService;

    @Mock
    private PlayerService payerService;
    
    @InjectMocks
    private GameRestController gameRestController;

    List<Game> games= new ArrayList<Game>();

    @BeforeEach
    void setUp(){
        MockitoAnnotations.openMocks(this);

        User user1= new User(); user1.setId(1);
        User user2= new User(); user2.setId(1);

        Player player1= new Player();
        player1.setUser(user1);
        Player player2= new Player();
        player2.setUser(user2);

        List<Player> players= List.of(player1,player2);
        List<Player> playersGame2= List.of(player2,player1);

        Game game1= new Game();
        game1.setId(1);
        game1.setPlayers(players);
        game1.setNumPlayers(3);
        game1.setStart(LocalDateTime.of(2024,1,3,11,23));
        game1.setStatus(GameStatus.WAITING);
        

        Game game2= new Game();
        game2.setId(2);
        game2.setPlayers(playersGame2);
        game2.setNumPlayers(2);
        game2.setStart(LocalDateTime.of(2023,12,15,9,23));
        game2.setFinish(LocalDateTime.of(2023,12,15,10,5));
        game2.setStatus(GameStatus.FINISHED);

        games.add(game1);
        games.add(game2);

    }

    @Test
    void canGetAllGames(){
        List<Game> expectedGames= games;

        when(gameService.getAllGames(any(Pageable.class))).thenReturn(expectedGames);

        ResponseEntity<List<Game>> actualResponse= gameRestController.getAllGames(null, null, null, 1, 10);
       
        assertEquals(HttpStatus.OK, actualResponse.getStatusCode());
        assertEquals(2,actualResponse.getBody().size());
        assertTrue(1== actualResponse.getBody().get(0).getId());
    }

    

    
}
