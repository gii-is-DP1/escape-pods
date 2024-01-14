package org.springframework.samples.petclinic.sheltercard;

import static org.junit.Assert.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.samples.petclinic.shelterCard.ShelterCard;
import org.springframework.samples.petclinic.shelterCard.ShelterCardRepository;
import org.springframework.samples.petclinic.shelterCard.ShelterCardService;

public class shelterCardServiceTests {
    @Mock
    private ShelterCardRepository shelterCardRepository;

    @InjectMocks
    private ShelterCardService shelterCardService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllShelterCardsTest() {
        ShelterCard shelterCard1 = new ShelterCard();
        ShelterCard shelterCard2 = new ShelterCard();

        List<ShelterCard> expectedShelterCards = Arrays.asList(shelterCard1, shelterCard2);

        when(shelterCardRepository.findAll()).thenReturn(expectedShelterCards);

        List<ShelterCard> actualShelterCards = shelterCardService.getAllShelterCards();

        assertEquals(expectedShelterCards, actualShelterCards);
        verify(shelterCardRepository, times(1)).findAll();
    }

    @Test
    void getShelterCardByIdTest() {
        Integer shelterCardId = 1;
        ShelterCard expectedShelterCard = new ShelterCard();
        when(shelterCardRepository.findById(shelterCardId)).thenReturn(Optional.of(expectedShelterCard));

        ShelterCard actualShelterCard = shelterCardService.getShelterCardById(shelterCardId).get();

        assertEquals(expectedShelterCard, actualShelterCard);
        verify(shelterCardRepository, times(1)).findById(shelterCardId);
    }

    @Test
    void getShelterCardNotFound() {
        Integer shelterCardId = 1;
        when(shelterCardRepository.findById(shelterCardId)).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> shelterCardService.getShelterCardById(shelterCardId).get());
        verify(shelterCardRepository, times(1)).findById(shelterCardId);
    }

    @Test
    void saveShelterCardTest() {
        ShelterCard shelterCard = new ShelterCard();
        when(shelterCardRepository.save(shelterCard)).thenReturn(shelterCard);

        ShelterCard actualShelterCard = shelterCardService.save(shelterCard);

        assertEquals(shelterCard, actualShelterCard);
        verify(shelterCardRepository, times(1)).save(shelterCard);
    }

    @Test
    void deleteShelterCardTest() {
        Integer shelterCardId = 1;
        ShelterCard expectedShelterCard = new ShelterCard();
        expectedShelterCard.setId(shelterCardId);

        doNothing().when(shelterCardRepository).deleteById(shelterCardId);
        when(shelterCardRepository.findById(shelterCardId)).thenReturn(Optional.of(expectedShelterCard));

        shelterCardService.delete(shelterCardId);

        assertEquals(expectedShelterCard, shelterCardService.getShelterCardById(shelterCardId).get());

        verify(shelterCardRepository, times(1)).deleteById(shelterCardId);
    }
}
