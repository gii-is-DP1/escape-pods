package org.springframework.samples.petclinic.gameplayer;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertThrows;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.dao.DataAccessException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.samples.petclinic.game.Game;

public class GamePlayerServiceTest {

    @Mock
    private GamePlayerRepository gamePlayerRepository;

    @InjectMocks
    private GamePlayerService gamePlayerService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllGamePlayers() {
        List<GamePlayer> expectedGamePlayers = List.of(new GamePlayer(), new GamePlayer(), new GamePlayer());

        when(gamePlayerRepository.findAll()).thenReturn(expectedGamePlayers);
        List<GamePlayer> actualGamePlayers = gamePlayerService.getAllGamePlayers();

        assertEquals(expectedGamePlayers, actualGamePlayers);
        verify(gamePlayerRepository, times(1)).findAll();
    }

    @Test
    void getGamePlayerByIdFoundTest() {
        Integer gamePlayerId = 1;
        GamePlayer expectedGamePlayer = new GamePlayer();
        GamePlayer gamePlayer2 = new GamePlayer();

        gamePlayer2.setId(3);
        expectedGamePlayer.setId(gamePlayerId);
        when(gamePlayerRepository.findById(gamePlayerId)).thenReturn(Optional.of(expectedGamePlayer));

        GamePlayer actualGamePlayer = gamePlayerService.getGamePlayerById(gamePlayerId).get();

        assertEquals(expectedGamePlayer, actualGamePlayer);
        assertFalse(actualGamePlayer == gamePlayer2);
        verify(gamePlayerRepository, times(1)).findById(gamePlayerId);

    }

    @Test
    void getGamePlayerByIdNotFoundTest() {
        Integer id = 10;
        Game game = new Game();
        game.setId(id);
        Integer nonExistentGamePlayerId = 1;

        GamePlayer expectedGamePlayer = new GamePlayer();
        expectedGamePlayer.setGame(game);
        
        when(gamePlayerRepository.findById(id)).thenReturn(Optional.of(expectedGamePlayer));

        assertThrows(NoSuchElementException.class,
                () -> gamePlayerService.getGamePlayerById(nonExistentGamePlayerId).get());
        verify(gamePlayerRepository, times(1)).findById(nonExistentGamePlayerId);

    }

    @Test
    void getAllGamePlayersByGameIdFoundTest() {
        Integer gameId = 1;
        Game game1 = new Game();
        game1.setId(gameId);

        GamePlayer gamePlayer1 = new GamePlayer();
        GamePlayer gamePlayer2 = new GamePlayer();
        gamePlayer1.setGame(game1);
        gamePlayer2.setGame(game1);

        List<GamePlayer> expectedGamePlayers = List.of(gamePlayer1, gamePlayer2);
        when(gamePlayerRepository.findByGameId(gameId)).thenReturn(expectedGamePlayers);

        List<GamePlayer> actualGamePlayers = gamePlayerService.getGamePlayersByGameId(gameId);
        assertEquals(expectedGamePlayers, actualGamePlayers);
        verify(gamePlayerRepository, times(1)).findByGameId(gameId);

    }

    @Test
    void getAllGamePlayersByGameIdNotFoundTest() {
        Integer gameId = 1;
        Integer nonExistentGameId = 11;
        Game game1 = new Game();
        game1.setId(gameId);

        GamePlayer gamePlayer1 = new GamePlayer();
        GamePlayer gamePlayer2 = new GamePlayer();
        gamePlayer1.setGame(game1);
        gamePlayer2.setGame(game1);

        when(gamePlayerRepository.findByGameId(gameId)).thenReturn(List.of(gamePlayer1, gamePlayer2));

        assertTrue(gamePlayerService.getGamePlayersByGameId(nonExistentGameId).isEmpty());

        verify(gamePlayerRepository, times(1)).findByGameId(nonExistentGameId);

    }

}
