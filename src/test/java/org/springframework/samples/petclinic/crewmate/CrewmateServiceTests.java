package org.springframework.samples.petclinic.crewmate;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import static org.junit.jupiter.api.Assertions.assertIterableEquals;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.samples.petclinic.game.Game;


class CrewmateServiceTests {

    @Mock
    private CrewmateRepository crewmateRepository;

    @InjectMocks
    private CrewmateService crewmateService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllCrewmatesTest() {

        List<Crewmate> expectedCrewmates = List.of(new Crewmate(), new Crewmate());

        when(crewmateRepository.findAll()).thenReturn(expectedCrewmates);

        List<Crewmate> actualCrewmates = crewmateService.getAllCrewmates();
        System.out.println(actualCrewmates+","+ expectedCrewmates);
        
        assertIterableEquals(expectedCrewmates, actualCrewmates);
        verify(crewmateRepository, times(1)).findAll();
    }

    @Test
    void getCrewmateByIdFoundTest(){
        Integer crewmateId= 2;
        Crewmate expectedCrewmate= new Crewmate();
        expectedCrewmate.setId(crewmateId);

        when(crewmateRepository.findById(crewmateId)).thenReturn(Optional.of(expectedCrewmate));
        Crewmate actualCrewmate= crewmateService.getCrewmateById(crewmateId).get();

        assertTrue(actualCrewmate.getId()==crewmateId);
        verify(crewmateRepository,times(1)).findById(crewmateId);
    }

    @Test
    void getCrewmateByIdNotFoundTest(){
        Integer falseCrewmateId= 3;


        when(crewmateRepository.findById(falseCrewmateId)).thenReturn(Optional.empty());
        Crewmate actualCrewmate= crewmateService.getCrewmateById(falseCrewmateId).orElse(null);

        assertNull(actualCrewmate);
        verify(crewmateRepository,times(1)).findById(falseCrewmateId);
    }


    @Test 
    void getAllCrewmatesByGameIdFoundTest(){
        Integer gameId= 1;
        Game game1 = new Game();
        game1.setId(gameId);

        Crewmate crewmate1= new Crewmate();
        Crewmate crewmate2 = new Crewmate();
        crewmate1.setGame(game1);
        crewmate2.setGame(game1);

        List<Crewmate> expectedCrewmates= List.of(crewmate1,crewmate2);
        when(crewmateRepository.findByGameId(gameId)).thenReturn(expectedCrewmates);

        List<Crewmate> actualCrewmates = crewmateService.getAllCrewmatesByGameId(gameId);
        assertEquals(expectedCrewmates, actualCrewmates);
        verify(crewmateRepository, times(1)).findByGameId(gameId);

    }

    @Test 
    void getAllCrewmatesByGameIdNotFoundTest(){
        Integer gameId= 1;
        Integer nonExistentGameId= 11;
        Game game1 = new Game();
        game1.setId(gameId);

        Crewmate crewmate1= new Crewmate();
        Crewmate crewmate2 = new Crewmate();
        crewmate1.setGame(game1);
        crewmate2.setGame(game1);
        
        when(crewmateRepository.findByGameId(nonExistentGameId)).thenReturn(null);

        List<Crewmate> actualCrewmates = crewmateService.getAllCrewmatesByGameId(nonExistentGameId);
        assertNull(actualCrewmates);
        verify(crewmateRepository, times(1)).findByGameId(nonExistentGameId);

    }

    @Test
    void saveCrewmateTest(){
        Crewmate expectedCrewmate = new Crewmate();
        when(crewmateRepository.save(any(Crewmate.class))).thenAnswer(i ->
        i.getArguments()[0]);

        Crewmate actualCrewmate = crewmateService.save(expectedCrewmate);

        assertEquals(expectedCrewmate.getId(), actualCrewmate.getId());
        verify(crewmateRepository, times(1)).save(any(Crewmate.class));
    }


}
