package org.springframework.samples.petclinic.beacon;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.samples.petclinic.game.Game;

class BeaconServiceTests {

    @Mock
    private BeaconRepository beaconRepository;

    @InjectMocks
    private BeaconService beaconService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        // BeaconService is now automatically instantiated with the mocked dependencies
    }

    @Test
    void getAllBeaconsTest() {
        Beacon beacon1 = new Beacon();
        Beacon beacon2 = new Beacon();


        List<Beacon> expectedBeacons = Arrays.asList(beacon1, beacon2);

        when(beaconRepository.findAll()).thenReturn(expectedBeacons);

        List<Beacon> actualBeacons = beaconService.getAllBeacons();

        assertEquals(expectedBeacons, actualBeacons);
    }
    
    @Test
    void getBeaconByIdTest() {
        Integer beaconId = 1;
        Beacon expectedBeacon = new Beacon();
        when(beaconRepository.findById(beaconId)).thenReturn(Optional.of(expectedBeacon));

        Beacon actualBeacon = beaconService.getBeaconById(beaconId).get();

        assertEquals(expectedBeacon, actualBeacon);
        verify(beaconRepository, times(1)).findById(beaconId);
    }

    @Test
    void getBeaconByColorTest() {
        String color = "BLACK";
        List<Beacon> expectedBeacons = Arrays.asList(new Beacon(), new Beacon());
        when(beaconRepository.findByColor1(color)).thenReturn(expectedBeacons);

        List<Beacon> actualBeacons = beaconService.getBeaconByColor(color);

        assertEquals(expectedBeacons, actualBeacons);
    }

    @Test
    void getBeaconsByGameIdTest() {
        Integer gameId = 1;
        List<Beacon> expectedBeacons = Arrays.asList(new Beacon(), new Beacon());
        when(beaconRepository.findByGameId(gameId)).thenReturn(expectedBeacons);

        List<Beacon> actualBeacons = beaconService.getBeaconsByGameId(gameId);

        assertEquals(expectedBeacons, actualBeacons);
    }

    @Test
    void saveBeaconTest() {
        Beacon beacon = new Beacon();
        when(beaconRepository.save(beacon)).thenReturn(beacon);

        Beacon actualBeacon = beaconService.save(beacon);

        assertEquals(beacon, actualBeacon);
    }

    @Test
    void deleteBeaconTest() {
        Integer beaconId = 1;
        Beacon expectedBeacon = new Beacon();
        expectedBeacon.setId(beaconId);

        doNothing().when(beaconRepository).deleteById(beaconId);
        when(beaconRepository.findById(beaconId)).thenReturn(Optional.of(expectedBeacon));

        beaconService.delete(beaconId);

        assertEquals(expectedBeacon, beaconService.getBeaconById(beaconId).get());

        verify(beaconRepository, times(1)).deleteById(beaconId);
    }

    @Test
    void deleteBeaconByGameIdTest() {

        Integer gameId = 1;
        Game game1 = new Game();
        game1.setId(gameId);

        Beacon expectedBeacon = new Beacon();
        expectedBeacon.setId(2);
        expectedBeacon.setGame(game1);

        when(beaconRepository.deleteByGameId(game1.getId())).thenReturn(1);
        beaconService.deleteByGameId(gameId);
        assertTrue(1== beaconRepository.deleteByGameId(game1.getId()));
        verify(beaconRepository, times(2)).deleteByGameId(gameId);

    }
}
