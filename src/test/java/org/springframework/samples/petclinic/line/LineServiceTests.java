package org.springframework.samples.petclinic.line;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertThrows;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.samples.petclinic.game.Game;
import org.springframework.samples.petclinic.game.GameRepository;
import org.springframework.samples.petclinic.game.GameService;

class LineServiceTests {

    @Mock
    private LineRepository lineRepository;

    @Mock
    private GameRepository gameRepository;

    @Mock
    private GameService gameService;

    @InjectMocks
    private LineService lineService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void canGetAllLines() {
        List<Line> expectedLines = List.of(new Line(), new Line());

        when(lineRepository.findAll()).thenReturn(expectedLines);

        assertEquals(expectedLines, lineService.getAllLines());
        verify(lineRepository, times(1)).findAll();

    }

    @Test
    void canGetLineById() {
        // Integer nonExistentLineId= 12;
        Integer lineId = 1;
        Line expectedLine = new Line();
        expectedLine.setId(lineId);

        when(lineRepository.findById(lineId)).thenReturn(Optional.of(expectedLine));

        assertEquals(expectedLine, lineService.getLineById(lineId).get());
        assertTrue(expectedLine.getId() == lineService.getLineById(lineId).get().getId());

        verify(lineRepository, times(2)).findById(lineId);
    }

    @Test
    void cantGetLineById_throwsNoSuchElementException() {
        Integer nonExistentLineId = 12;
        Integer lineId = 1;
        Line expectedLine = new Line();
        expectedLine.setId(lineId);
        when(lineRepository.findById(lineId)).thenReturn(Optional.of(expectedLine));

        assertThrows(NoSuchElementException.class, () -> lineService.getLineById(nonExistentLineId).get());
        verify(lineRepository, times(1)).findById(nonExistentLineId);
    }

    @Test
    void canGetLinesByGameId() {
        Integer gameId = 1;
        Game game = new Game();
        game.setId(gameId);

        Line line1 = new Line();
        line1.setGame(game);
        Line line2 = new Line();
        line2.setGame(game);
        List<Line> expectedLines = List.of(line1, line2);

        when(lineRepository.findByGameId(gameId)).thenReturn(expectedLines);
        assertEquals(expectedLines, lineService.getAllLinesByGameId(gameId));
        verify(lineRepository, times(1)).findByGameId(gameId);
    }

    @Test
    void cantGetLinesByGameId() {
        Integer nonExistentGameId = 9;

        // arrange de las lineas asociadas
        Integer gameId = 1;
        Game game = new Game();
        game.setId(gameId);

        Line line1 = new Line();
        line1.setGame(game);
        Line line2 = new Line();
        line2.setGame(game);
        // List<Line> expectedLines= List.of(line1,line2);
        when(lineRepository.findByGameId(nonExistentGameId)).thenReturn(null);

        assertNull(lineService.getAllLinesByGameId(nonExistentGameId));
        verify(lineRepository, times(1)).findByGameId(nonExistentGameId);

    }

    @Test
    void canSaveLine() {
        Line line = new Line();
        when(lineRepository.save(line)).thenReturn(line);

        Line actualLine = lineService.save(line);

        assertEquals(line, actualLine);
    }

    @Test
    void canDeleteLine() {
        Integer lineId = 1;
        Line expectedLine = new Line();
        expectedLine.setId(lineId);

        doNothing().when(lineRepository).deleteById(lineId);
        when(lineRepository.findById(lineId)).thenReturn(Optional.of(expectedLine));

        lineService.delete(lineId);

        assertEquals(expectedLine, lineService.getLineById(lineId).get());

        verify(lineRepository, times(1)).deleteById(lineId);
    }

    @Test
    void deleteLineByGameIdTest() {

        Integer gameId = 1;
        Game game1 = new Game();
        game1.setId(gameId);

        Line expectedLine = new Line();
        expectedLine.setId(2);
        expectedLine.setGame(game1);

        when(lineRepository.deleteByGameId(game1.getId())).thenReturn(1);
        lineService.deleteByGameId(gameId);
        assertTrue(1== lineRepository.deleteByGameId(game1.getId()));
        verify(lineRepository, times(2)).deleteByGameId(gameId);

    }

}
