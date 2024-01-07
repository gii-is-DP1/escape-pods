package org.springframework.samples.petclinic.crewmate;

import static org.junit.jupiter.api.Assertions.assertIterableEquals;
import static org.mockito.Mockito.*;

import java.util.List;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

class CrewmateServiceTest {

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

}
