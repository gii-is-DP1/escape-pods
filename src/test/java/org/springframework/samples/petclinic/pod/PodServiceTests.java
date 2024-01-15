package org.springframework.samples.petclinic.pod;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.samples.petclinic.game.Game;
import org.springframework.samples.petclinic.game.GameRepository;

public class PodServiceTests {

    @Mock
    private PodRepository podRepository;

    @Mock
    private GameRepository gameRepository;

    @InjectMocks
    private PodService podService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllPodsTest() {
        Pod pod1 = new Pod();
        Pod pod2 = new Pod();

        List<Pod> expectedPods = Arrays.asList(pod1, pod2);

        when(podRepository.findAll()).thenReturn(expectedPods);

        List<Pod> actualPods = podService.getAllPods();

        assertEquals(expectedPods, actualPods);

    }

    @Test
    void getPodsByIdTest() {
        Integer podId = 1;
        Pod expectedPod = new Pod();
        when(podRepository.findById(podId)).thenReturn(Optional.of(expectedPod));

        Pod actualPod = podService.getPodsById(podId).get();

        assertEquals(expectedPod, actualPod);
        verify(podRepository, times(1)).findById(podId);
    }

    @Test
    void getPodsByCapacityTest() {
        Integer capacity = 1;
        List<Pod> expectedPods = Arrays.asList(new Pod(), new Pod());
        when(podRepository.findByCapacity(capacity)).thenReturn(expectedPods);

        List<Pod> actualPods = podService.getPodsByCapacity(capacity);

        assertEquals(expectedPods, actualPods);
        verify(podRepository, times(1)).findByCapacity(capacity);
    }

    @Test
    void getPodsByGameIdTest() {
        Integer gameId = 1;
        List<Pod> expectedPods = Arrays.asList(new Pod(), new Pod());
        when(podRepository.findByGameId(gameId)).thenReturn(expectedPods);

        List<Pod> actualPods = podService.getPodsByGameId(gameId);

        assertEquals(expectedPods, actualPods);
    }

    @Test
    void savePodTest() {
        Pod pod = new Pod();
        when(podRepository.save(pod)).thenReturn(pod);
        Pod actualPod = podService.save(pod);
        assertEquals(pod, actualPod);
    }

    @Test
    void deletePodTest() {
        Integer podId = 1;
        Pod expectedPod = new Pod();
        expectedPod.setId(podId);

        doNothing().when(podRepository).deleteById(podId);
        when(podRepository.findById(podId)).thenReturn(Optional.of(expectedPod));

        podService.delete(podId);

        assertEquals(expectedPod, podService.getPodsById(podId).get());

        verify(podRepository, times(1)).deleteById(podId);

    }

    @Test
    void deletePodByGameIdTest() {

        Integer gameId = 1;
        Game game1 = new Game();
        game1.setId(gameId);

        Pod expectedPod = new Pod();
        expectedPod.setId(2);
        expectedPod.setGame(game1);

        when(podRepository.deleteByGameId(game1.getId())).thenReturn(1);
        podService.deleteByGameId(gameId);
        assertTrue(1 == podRepository.deleteByGameId(game1.getId()));
        verify(podRepository, times(2)).deleteByGameId(gameId);

    }

}
