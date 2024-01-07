package org.springframework.samples.petclinic.game;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertIterableEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.samples.petclinic.player.Player;

import org.springframework.samples.petclinic.player.PlayerRepository;
import org.springframework.samples.petclinic.player.PlayerService;

class GameServiceTests {

    @Mock
    private GameRepository gameRepository;

    //@Mock
   // private PlayerRepository playerRepository;

    //@Mock
    //private PlayerService playerService;

    @InjectMocks
    private GameService gameService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        // GameService is now automatically instantiated with the mocked dependencies
    }

    @Test
    void getAllGamesTest() {
        Game game1 = new Game();
        Game game2 = new Game();
        /*
         * para que los test de servicios salgan bien, es necesario que lo que se
         * pruebe( findAll())
         * este bien declarado siempre, en este caso con el objeto paging como parametro
         * para evitar lios
         * 
         */
        Pageable paging;
        paging = PageRequest.of(0, 10);

        List<Game> expectedGames = Arrays.asList(game1, game2);
        /*
         * si se esta llamando al findAll le tenemo que devolver la lista de juegos q
         * hemos creado para q funcione
         * correctamente, seguramnente, este proceso sera necesario en toda prueba q
         * conlleve este tipo de operacion
         * 
         */
        when(gameRepository.findAll(any(Pageable.class))).thenReturn(expectedGames);

        // se esta llamando 1 vez al findAll cada vez que se invoca el getAllGames()
        List<Game> actualGames = gameService.getAllGames(paging);
        // System.out.println(gameService.getAllGames(paging));

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
    //TODO quitar la segunda parte del test(la de crearGame con id 1 y el resto de comprobaciones)
    void getGameNotFoundTest() {
        Integer gameId = 1;
        Integer falseGameId= 20;
        Game expectedGame= new Game();
        expectedGame.setId(gameId);

        when(gameRepository.findById(gameId)).thenReturn(Optional.of(expectedGame));
        when(gameRepository.findById(falseGameId)).thenReturn(Optional.empty());

        Game actualGame = gameService.getGameById(falseGameId).orElse(null);

        assertFalse(gameService.getGameById(gameId).orElse(null).getId() == null);
        assertEquals(expectedGame.getId(), gameService.getGameById(gameId).orElse(null).getId());
        assertNull(actualGame);
        verify(gameRepository, times(2)).findById(gameId);
    }

    
    @Test
    void saveGameTest() {
        List<Player> players = List.of(new Player()) ;
        Game expectedGame = new Game();
        expectedGame.setPlayers(players);
        when(gameRepository.save(any(Game.class))).thenAnswer(i ->

        i.getArguments()[0]);

        Game actualGame = gameService.save(expectedGame);

        assertEquals(expectedGame.getPlayers(), actualGame.getPlayers());
        verify(gameRepository, times(1)).save(any(Game.class));

    }

}
