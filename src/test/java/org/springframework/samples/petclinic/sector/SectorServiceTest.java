package org.springframework.samples.petclinic.sector;

import static org.junit.Assert.assertThrows;
import static org.junit.jupiter.api.Assertions.assertEquals;
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

import org.springframework.samples.petclinic.line.LineRepository;

public class SectorServiceTest {

    @Mock
    private SectorRepository sectorRepository;
    @Mock
    private LineRepository lineRepository;

    @InjectMocks
    private SectorService sectorService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllSectorsTest() {
        Sector sector1 = new Sector();
        Sector sector2 = new Sector();

        List<Sector> expectedSectors = Arrays.asList(sector1, sector2);

        when(sectorRepository.findAll()).thenReturn(expectedSectors);

        List<Sector> actualSectors = sectorService.getAllSectors();

        assertEquals(expectedSectors, actualSectors);
        verify(sectorRepository, times(1)).findAll();
    }

    @Test
    void getSectorByIdTest() {
        Integer sectorId = 1;
        Sector expectedSector = new Sector();
        when(sectorRepository.findById(sectorId)).thenReturn(Optional.of(expectedSector));

        Sector actualSector = sectorService.getSectorById(sectorId).get();

        assertEquals(expectedSector, actualSector);
        verify(sectorRepository, times(1)).findById(sectorId);
    }

    @Test
    void getSectorNotFoundTest() {
        Integer sectorId = 1;
        when(sectorRepository.findById(sectorId)).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> sectorService.getSectorById(sectorId).get());
        verify(sectorRepository, times(1)).findById(sectorId);
    }

    @Test
    void saveSectorTest() {
        Sector sector = new Sector();
        when(sectorRepository.save(sector)).thenReturn(sector);

        Sector actualSector = sectorService.save(sector);

        assertEquals(sector, actualSector);
        verify(sectorRepository, times(1)).save(sector);
    }

    @Test
    void deleteSectorTest() {
        Integer sectorId = 1;
        Sector expectedSector = new Sector();
        expectedSector.setId(sectorId);

        doNothing().when(sectorRepository).deleteById(sectorId);
        when(sectorRepository.findById(sectorId)).thenReturn(Optional.of(expectedSector));

        sectorService.delete(sectorId);

        assertEquals(expectedSector, sectorService.getSectorById(sectorId).get());

        verify(sectorRepository, times(1)).deleteById(sectorId);
    }

}
