package org.springframework.samples.petclinic.game;

import static org.junit.Assert.assertThrows;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertIterableEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.samples.petclinic.player.Player;

class GameServiceTests {

    @Mock
    private GameRepository gameRepository;

    @InjectMocks
    private GameService gameService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllGamesTest() {
        Game game1 = new Game();
        Game game2 = new Game();
        Pageable paging;
        paging = PageRequest.of(0, 10);

        List<Game> expectedGames = Arrays.asList(game1, game2);
        when(gameRepository.findAll(any(Pageable.class))).thenReturn(expectedGames);

        List<Game> actualGames = gameService.getAllGames(paging);

        assertIterableEquals(expectedGames, actualGames);
        verify(gameRepository, times(1)).findAll(paging);
    }

    @Test
    void getGameTest() {
        Integer gameId = 1;
        Game expectedGame = new Game();
        when(gameRepository.findById(gameId)).thenReturn(Optional.of(expectedGame));

        Game actualGame = gameService.getGameById(gameId).get();

        assertEquals(expectedGame, actualGame);
        verify(gameRepository, times(1)).findById(gameId);
    }

    @Test
    void getGameNotFoundTest() {
        Integer gameId = 1;
        Integer falseGameId = 20;
        Game expectedGame = new Game();
        expectedGame.setId(gameId);

        when(gameRepository.findById(gameId)).thenReturn(Optional.of(expectedGame));

        assertThrows(NoSuchElementException.class, () -> gameService.getGameById(falseGameId).get());
        verify(gameRepository, times(1)).findById(falseGameId);
    }

    @Test
    void saveGameTest() {
        List<Player> players = List.of(new Player());
        Game expectedGame = new Game();
        expectedGame.setPlayers(players);
        when(gameRepository.save(any(Game.class))).thenAnswer(i -> i.getArguments()[0]);

        Game actualGame = gameService.save(expectedGame);

        assertEquals(expectedGame.getPlayers(), actualGame.getPlayers());
        verify(gameRepository, times(1)).save(any(Game.class));

    }

    @Test
    void deleteGameTest() {
        Integer gameId = 1;
        Game expectedGame = new Game();
        expectedGame.setId(gameId);

        doNothing().when(gameRepository).deleteById(gameId);
        when(gameRepository.findById(gameId)).thenReturn(Optional.of(expectedGame));

        gameService.delete(gameId);

        assertEquals(expectedGame, gameService.getGameById(gameId).get());

        verify(gameRepository, times(1)).deleteById(gameId);
    }


}
