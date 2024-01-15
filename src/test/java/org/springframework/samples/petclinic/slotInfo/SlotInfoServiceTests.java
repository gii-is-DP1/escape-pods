package org.springframework.samples.petclinic.slotInfo;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
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
import org.springframework.samples.petclinic.game.Game;

class SlotInfoServiceTests {

    @Mock
    private SlotInfoRepository slotInfoRepository;

    @InjectMocks
    private SlotInfoService slotInfoService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllSlotInfosTest() {
        SlotInfo slotInfo1 = new SlotInfo();
        SlotInfo slotInfo2 = new SlotInfo();

        List<SlotInfo> expectedSlotInfos = Arrays.asList(slotInfo1, slotInfo2);

        when(slotInfoRepository.findAll()).thenReturn(expectedSlotInfos);

        List<SlotInfo> actualSlotInfos = slotInfoService.getAllSlotInfos();

        assertEquals(expectedSlotInfos, actualSlotInfos);
    }

    @Test
    void getSlotInfoByIdTest() {
        Integer slotInfoId = 1;
        SlotInfo expectedSlotInfo = new SlotInfo();
        when(slotInfoRepository.findById(slotInfoId)).thenReturn(Optional.of(expectedSlotInfo));

        SlotInfo actualSlotInfo = slotInfoService.getSlotInfoById(slotInfoId).get();

        assertEquals(expectedSlotInfo, actualSlotInfo);
        verify(slotInfoRepository, times(1)).findById(slotInfoId);
    }

    @Test
    void getSlotInfoByIdNotFoundTest() {
        Integer slotInfoId = 1;
        Integer falseSlotInfoId = 20;
        SlotInfo expectedSlotInfo = new SlotInfo();
        expectedSlotInfo.setId(slotInfoId);

        when(slotInfoRepository.findById(slotInfoId)).thenReturn(Optional.of(expectedSlotInfo));

        assertThrows(NoSuchElementException.class, () -> slotInfoService.getSlotInfoById(falseSlotInfoId).get());
        verify(slotInfoRepository, times(1)).findById(falseSlotInfoId);
    }

    @Test
    void getSlotInfoByGameIdTest() {
        Integer gameId = 1;
        List<SlotInfo> expectedSlotInfos = Arrays.asList(new SlotInfo(), new SlotInfo());
        when(slotInfoRepository.findByGameId(gameId)).thenReturn(expectedSlotInfos);

        List<SlotInfo> actualSlotInfos = slotInfoService.getSlotInfoByGameId(gameId);

        assertEquals(expectedSlotInfos, actualSlotInfos);
    }

    @Test
    void saveSlotInfoTest() {
        SlotInfo slotInfo = new SlotInfo();
        when(slotInfoRepository.save(slotInfo)).thenReturn(slotInfo);

        SlotInfo actualSlotInfo = slotInfoService.save(slotInfo);

        assertEquals(slotInfo, actualSlotInfo);
    }

    @Test
    void deleteSlotInfoTest() {
        Integer slotInfoId = 1;
        SlotInfo expectedSlotInfo = new SlotInfo();
        expectedSlotInfo.setId(slotInfoId);

        doNothing().when(slotInfoRepository).deleteById(slotInfoId);
        when(slotInfoRepository.findById(slotInfoId)).thenReturn(Optional.of(expectedSlotInfo));

        slotInfoService.delete(slotInfoId);

        assertEquals(expectedSlotInfo, slotInfoService.getSlotInfoById(slotInfoId).get());

        verify(slotInfoRepository, times(1)).deleteById(slotInfoId);
    }
    
    @Test
    void deleteSlotInfoByGameIdTest() {

        Integer gameId = 1;
        Game game1 = new Game();
        game1.setId(gameId);

        SlotInfo expectedSlotInfo = new SlotInfo();
        expectedSlotInfo.setId(2);
        expectedSlotInfo.setGame(game1);

        when(slotInfoRepository.deleteByGameId(game1.getId())).thenReturn(1);
        slotInfoService.deleteByGameId(gameId);
        assertTrue(1== slotInfoRepository.deleteByGameId(game1.getId()));
        verify(slotInfoRepository, times(2)).deleteByGameId(gameId);

    }
}
