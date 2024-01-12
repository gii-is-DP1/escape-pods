package org.springframework.samples.petclinic.line;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
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
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.samples.petclinic.beacon.Beacon;
import org.springframework.samples.petclinic.exceptions.ResourceNotFoundException;
import org.springframework.samples.petclinic.game.Game;
import org.springframework.samples.petclinic.player.Player;
import org.springframework.samples.petclinic.player.PlayerService;
import org.springframework.samples.petclinic.user.User;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import lombok.With;

@WebMvcTest(LineRestController.class)
public class LineRestControllerTests {

    @MockBean
    private LineService lineService;

    @Autowired
    private MockMvc mockMvc;

    private Line line1;
    private Line line2;

    private List<Line> lines;
    ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        line1 = new Line();
        line1.setId(1);

        line2 = new Line();
        line2.setId(2);

        lines = new ArrayList<Line>();
        lines.add(line1);
        lines.add(line2);

        objectMapper = new ObjectMapper();
    }

    @Test
    @WithMockUser(username = "player2", password = "0wn3r")
    void canGetAllLines() throws Exception {

        when(lineService.getAllLines()).thenReturn(lines);

        MockHttpServletRequestBuilder requestBuilder = get("/api/v1/lines")
                .with(csrf());

        MvcResult response = mockMvc.perform(requestBuilder)
                .andExpect(status().isOk())
                .andReturn();

        String responseBody = response.getResponse().getContentAsString();
        List<Line> ActualLines = objectMapper.readValue(responseBody, List.class);

        assertEquals(lines.size(), ActualLines.size());
    }

    @Test
    @WithMockUser(username = "player2", password = "0wn3r")
    void canCreateLine() throws Exception {
        Game game = new Game();
        Beacon beacon = new Beacon();
        Line line = new Line();
        line.setId(1);
        line.setGame(game);
        line.setNumber(1);
        line.setBeacon(beacon);

        objectMapper = new ObjectMapper();

        when(lineService.save(any(Line.class))).thenAnswer(i -> i.getArguments()[0]);
        String json = objectMapper.writeValueAsString(line);

        MockHttpServletRequestBuilder requestBuilder = post("/api/v1/lines")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json)
                .with(csrf());

        MvcResult response = mockMvc.perform(requestBuilder)
                .andExpect(status().isCreated())
                .andReturn();

        String responseBody = response.getResponse().getContentAsString();
        Line actualLine = objectMapper.readValue(responseBody, Line.class);

        assertTrue(1 == actualLine.getId());
    }

    @Test
    @WithMockUser("PLAYER")
    void cantCreateLine_BadRequest() throws Exception {

        // con datos incorrectos
        Beacon beacon = new Beacon();
        Line line = new Line();
        line.setId(-1);
        line.setGame(null);
        line.setNumber(-1);
        line.setBeacon(beacon);

        objectMapper = new ObjectMapper();

        when(lineService.save(any(Line.class))).thenAnswer(i -> i.getArguments()[0]);
        String json = objectMapper.writeValueAsString(line);

        MockHttpServletRequestBuilder requestBuilder = post("/api/v1/lines")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json)
                .with(csrf());

        MvcResult result = mockMvc.perform(requestBuilder)
                .andExpect(status().isBadRequest())
                .andReturn();
        Integer actualStatus = result.getResponse().getStatus();
        assertTrue(400 == actualStatus);

    }

    // Debido a que las lines son una entidad fija, estas no cambian, por lo que
    // no se puede testear su modificación.

    @Test
    @WithMockUser("PLAYER")
    void canDeleteLine() throws Exception {
        Integer line1Id = 1;

        ObjectMapper objectMapper = new ObjectMapper();

        when(lineService.getLineById(line1Id)).thenReturn(Optional.of(line1));
        doNothing().when(lineService).delete(line1Id);

        String json = objectMapper.writeValueAsString(line1);

        MockHttpServletRequestBuilder requestBuilder = delete("/api/v1/lines/{lineId}", line1Id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(json)
                .with(csrf());

        mockMvc.perform(requestBuilder)
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser("PLAYER")
    void cantDeleteLine_NotFound() throws Exception {
        Integer line1Id = 1;
        Integer nonExistendBeaconId = 33;

        ObjectMapper objectMapper = new ObjectMapper();

        when(lineService.getLineById(nonExistendBeaconId)).thenThrow(ResourceNotFoundException.class);
        doNothing().when(lineService).delete(line1Id);

        String json = objectMapper.writeValueAsString(line1);

        MockHttpServletRequestBuilder requestBuilder = delete("/api/v1/lines/{lineId}", line1Id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(json)
                .with(csrf());

        mockMvc.perform(requestBuilder)
                .andExpect(status().isNotFound());
    }

}
