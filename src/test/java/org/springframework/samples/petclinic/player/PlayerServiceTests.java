package org.springframework.samples.petclinic.player;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertThrows;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertIterableEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;


import org.springframework.samples.petclinic.exceptions.ResourceNotFoundException;
import org.springframework.samples.petclinic.game.Game;
import org.springframework.samples.petclinic.game.GameRepository;

public class PlayerServiceTests {
    @Mock
    private PlayerRepository playerRepository;

    @Mock
    private GameRepository gameRepository;

    @InjectMocks
    private PlayerService playerService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        // PlayerService is now automatically instantiated with the mocked dependencies
    }

    @Test
    void getAllPlayersTest() {
        Player player1 = new Player();
        Player player2 = new Player();
        
        List<Player> expectedPlayers = Arrays.asList(player1, player2);
        
        when(playerRepository.findAll()).thenReturn(expectedPlayers);

        List<Player> actualPlayers = playerService.findAll();

        assertIterableEquals(expectedPlayers, actualPlayers);
        verify(playerRepository, times(1)).findAll();
    }

    @Test
    void getPlayerByIdFoundTest() {
        Integer playerId = 1;
        Player expectedPlayer = new Player();
        Player player2 = new Player();

        player2.setId(3);
        expectedPlayer.setId(playerId);
        when(playerRepository.findById(playerId)).thenReturn(Optional.of(expectedPlayer));

        Player actualPlayer = playerService.findPlayerById(playerId);

        assertEquals(expectedPlayer, actualPlayer);
        assertFalse(actualPlayer == player2);
        verify(playerRepository, times(1)).findById(playerId);

    }

    @Test
    void getPlayerByIdNotFoundTest() { 
        Integer id = 10;
        Player player = new Player();
        player.setId(id);
        Integer nonExistentPlayerId = 1;

        Player expectedGamePlayer = new Player();
        expectedGamePlayer.setId(id);
        
        when(playerRepository.findById(id)).thenReturn(Optional.of(expectedGamePlayer));

        assertThrows(ResourceNotFoundException.class, () -> playerService.findPlayerById(nonExistentPlayerId));
        verify(playerRepository, times(1)).findById(nonExistentPlayerId);
    }

    @Test
    void savePlayerTest() {
        Player expectedPlayer = new Player();
        when(playerRepository.save(any(Player.class))).thenAnswer(i -> i.getArguments()[0]);

        Player actualPlayer = playerService.savePlayer(expectedPlayer);
        assertEquals(expectedPlayer, actualPlayer);
        verify(playerRepository, times(1)).save(any(Player.class));
    }

    @Test
    void updatePlayerTest() {
        Integer playerId = 1;
        Player expectedPlayer = new Player();
        expectedPlayer.setId(playerId);

        when(playerRepository.findById(playerId)).thenReturn(Optional.of(expectedPlayer));
        when(playerRepository.save(any(Player.class))).thenAnswer(i -> i.getArguments()[0]);

        Player actualPlayer = playerService.updatePlayer(expectedPlayer, playerId);

        assertEquals(expectedPlayer, actualPlayer);
        verify(playerRepository, times(1)).findById(playerId);
        verify(playerRepository, times(1)).save(any(Player.class));
    }

    @Test
    void deletePlayerTest() {
        Integer playerId = 1;
        Player expectedPlayer = new Player();
        expectedPlayer.setId(playerId);

        Player player2 = new Player();
        player2.setId(2);

        Game game = new Game();
        List<Player> players = new ArrayList<>();
        players.add(expectedPlayer);
        players.add(player2);
        game.setPlayers(players);

        doNothing().when(playerRepository).deleteById(playerId);
        when(playerRepository.findById(playerId)).thenReturn(Optional.of(expectedPlayer));
        when(gameRepository.findPlayerGames(playerId)).thenReturn(List.of(game));
        
        playerService.deletePlayer(playerId);

        assertEquals(expectedPlayer, playerService.findPlayerById(playerId));
        verify(playerRepository, times(1)).delete(expectedPlayer);
    }
}
