package org.springframework.samples.petclinic.sheltercard;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.samples.petclinic.exceptions.ResourceNotFoundException;
import org.springframework.samples.petclinic.game.Game;
import org.springframework.samples.petclinic.sector.Sector;
import org.springframework.samples.petclinic.shelterCard.ShelterCard;
import org.springframework.samples.petclinic.shelterCard.ShelterCardController;
import org.springframework.samples.petclinic.shelterCard.ShelterCardService;
import org.springframework.samples.petclinic.shelterCard.Type;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(ShelterCardController.class)
public class ShelterCardRestControllerTests {

    @MockBean
    private ShelterCardService shelterCardService;

    @Autowired
    private MockMvc mockMvc;

    private ShelterCard shelterCard1;
    private ShelterCard shelterCard2;

    private List<ShelterCard> shelterCards;
    ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        shelterCard1 = new ShelterCard();
        shelterCard1.setId(1);
        Game game = new Game();
        Sector sector = new Sector();
        shelterCard1.setExplosion(1);
        shelterCard1.setType(Type.BLUE);
        shelterCard1.setGame(game);
        shelterCard1.setSector(sector);

        shelterCard2 = new ShelterCard();
        shelterCard2.setId(2);
        Game game2 = new Game();
        Sector sector2 = new Sector();
        shelterCard1.setExplosion(2);
        shelterCard1.setType(Type.BLUE);
        shelterCard1.setGame(game2);
        shelterCard1.setSector(sector2);

        shelterCards = new ArrayList<ShelterCard>();
        shelterCards.add(shelterCard1);
        shelterCards.add(shelterCard2);

        objectMapper = new ObjectMapper();
    }

    @Test
    @WithMockUser(username = "player2", password = "0wn3r")
    void canGetAllShelterCards() throws Exception {
        when(shelterCardService.getAllShelterCards()).thenReturn(shelterCards);

        MockHttpServletRequestBuilder requestBuilder = get("/api/v1/shelterCards")
                .with(csrf());

        MvcResult response = mockMvc.perform(requestBuilder)
                .andExpect(status().isOk())
                .andReturn();

        String responseBody = response.getResponse().getContentAsString();
        List<ShelterCard> actualShelterCards = objectMapper.readValue(responseBody, List.class);

        assertEquals(shelterCards.size(), actualShelterCards.size());
    }

    @Test
    @WithMockUser(username = "player2", password = "0wn3r")
    void canCreateShelterCard() throws Exception {

        Game game = new Game();
        Sector sector = new Sector();
        ShelterCard shelterCard = new ShelterCard();
        shelterCard.setGame(game);
        shelterCard.setSector(sector);
        shelterCard.setId(1);
        shelterCard.setExplosion(1);
        shelterCard.setType(Type.BLUE);

        objectMapper = new ObjectMapper();
        when(shelterCardService.save(any(ShelterCard.class))).thenAnswer(i -> i.getArguments()[0]);
        String json = objectMapper.writeValueAsString(shelterCard);

        MockHttpServletRequestBuilder requestBuilder = post("/api/v1/shelterCards")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json)
                .with(csrf());

        MvcResult response = mockMvc.perform(requestBuilder)
                .andExpect(status().isCreated())
                .andReturn();

        String responseBody = response.getResponse().getContentAsString();
        ShelterCard actualShelterCard = objectMapper.readValue(responseBody, ShelterCard.class);

        assertTrue(1 == actualShelterCard.getId());
    }

    @Test
    @WithMockUser("PLAYER")
    void cantCreateShelterCard_BadRequest() throws Exception {

        // con datos incorrectos
        ShelterCard shelterCard = new ShelterCard();
        shelterCard.setGame(null);
        shelterCard.setSector(null);
        shelterCard.setId(-1);
        shelterCard.setExplosion(-1);
        shelterCard.setType(Type.BLUE);

        objectMapper = new ObjectMapper();

        when(shelterCardService.save(any(ShelterCard.class))).thenAnswer(i -> i.getArguments()[0]);
        String json = objectMapper.writeValueAsString(shelterCard);

        MockHttpServletRequestBuilder requestBuilder = post("/api/v1/shelterCards")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json)
                .with(csrf());

        MvcResult result = mockMvc.perform(requestBuilder)
                .andExpect(status().isBadRequest())
                .andReturn();

        Integer actualStatus = result.getResponse().getStatus();
        assertTrue(400 == actualStatus);
    }

    @Test
    @WithMockUser("PLAYER")
    void canUpdateShelterCard() throws Exception {
        Integer shelterCard1Id = 1;

        when(shelterCardService.getShelterCardById(shelterCard1Id)).thenReturn(Optional.of(shelterCard1));
        when(shelterCardService.save(shelterCard1)).thenReturn(shelterCard1);
        String shelterCard3JsonString = objectMapper.writeValueAsString(shelterCard1);

        MockHttpServletRequestBuilder requestBuilder = put("/api/v1/shelterCards/{id}", shelterCard1Id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(shelterCard3JsonString)
                .with(csrf());

        mockMvc.perform(requestBuilder)
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser("PLAYER")
    void cantUpdateShelterCard_NotFound() throws Exception {
        Integer nonExistentShelterCardId = 12;

        when(shelterCardService.getShelterCardById(nonExistentShelterCardId)).thenThrow(ResourceNotFoundException.class);
        when(shelterCardService.save(shelterCard1)).thenReturn(shelterCard1);

        String shelterCard3JsonString = objectMapper.writeValueAsString(shelterCard1);

        MockHttpServletRequestBuilder requestBuilder = put("/api/v1/shelterCards/{id}", nonExistentShelterCardId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(shelterCard3JsonString)
                .with(csrf());

        mockMvc.perform(requestBuilder)
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser("PLAYER")
    void canDeleteShelterCard() throws Exception {
        Integer shelterCard1Id = 1;

        when(shelterCardService.getShelterCardById(shelterCard1Id)).thenReturn(Optional.of(shelterCard1));
        doNothing().when(shelterCardService).delete(shelterCard1Id);

        String json = objectMapper.writeValueAsString(shelterCard1);
        MockHttpServletRequestBuilder requestBuilder = delete("/api/v1/shelterCards/{id}", shelterCard1Id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(json)
                .with(csrf());

        mockMvc.perform(requestBuilder)
                .andExpect(status().isNoContent());

    }

    @Test
    @WithMockUser("PLAYER")
    void cantDeleteShelterCard_NotFound() throws Exception {
        Integer shelterCard1Id = 1;
        Integer nonExistentShelterCardId = 33;

        when(shelterCardService.getShelterCardById(nonExistentShelterCardId)).thenThrow(ResourceNotFoundException.class);
        doNothing().when(shelterCardService).delete(shelterCard1Id);

        String json = objectMapper.writeValueAsString(shelterCard1);
        MockHttpServletRequestBuilder requestBuilder = delete("/api/v1/shelterCards/{id}", shelterCard1Id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(json)
                .with(csrf());

        mockMvc.perform(requestBuilder)
                .andExpect(status().isNotFound());

    }
}
