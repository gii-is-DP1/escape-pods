package org.springframework.samples.petclinic.sector;

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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.samples.petclinic.exceptions.ResourceNotFoundException;
import org.springframework.samples.petclinic.game.Game;
import org.springframework.samples.petclinic.line.Line;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(SectorController.class)
public class SectorControllerTests {

        @MockBean
        private SectorService sectorService;

        @Autowired
        private SectorController sectorController;

        @Autowired
        private MockMvc mockMvc;

        private Sector sector1;
        private Sector sector2;

        private List<Sector> sectors;
        ObjectMapper objectMapper = new ObjectMapper();

        @BeforeEach
        void setUp() {
                MockitoAnnotations.openMocks(this);

                Game game = new Game();
                Line line1 = new Line();
                Line line2 = new Line();
                List<Line> lines = new ArrayList<Line>();
                lines.add(line1);
                lines.add(line2);
                sector1 = new Sector();
                sector1.setId(1);
                sector1.setNumber(1);
                sector1.setScrap(false);
                sector1.setGame(game);
                sector1.setLines(lines);

                Game game2 = new Game();
                Line line3 = new Line();
                Line line4 = new Line();
                List<Line> lines2 = new ArrayList<Line>();
                lines.add(line3);
                lines.add(line4);
                sector2 = new Sector();
                sector2.setId(1);
                sector2.setNumber(1);
                sector2.setScrap(false);
                sector2.setGame(game2);
                sector2.setLines(lines2);

                sectors = new ArrayList<Sector>();
                sectors.add(sector1);
                sectors.add(sector2);
        }

        @Test
        @WithMockUser(username = "player2", password = "0wn3r")
        void canGetAllSectors() throws Exception {

                List<Sector> expectedSectors = sectors;

                when(sectorService.getAllSectors()).thenReturn(sectors);

                List<Sector> actualResponse = sectorController.getAllSectors(null, null);

                assertEquals(expectedSectors, actualResponse);

        }

        @Test
        @WithMockUser("PLAYER")
        void canCreateSector() throws Exception {

                Sector sector = new Sector();
                List<Line> line = new ArrayList<Line>();
                Game game = new Game();
                sector.setId(1);
                sector.setNumber(3);
                sector.setScrap(false);
                sector.setLines(line);
                sector.setGame(game);

                objectMapper = new ObjectMapper();
                when(sectorService.save(any(Sector.class))).thenAnswer(i -> i.getArguments()[0]);
                String json = objectMapper.writeValueAsString(sector);

                MockHttpServletRequestBuilder requestBuilder = post("/api/v1/sectors")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json)
                                .with(csrf());
                MvcResult result = mockMvc.perform(requestBuilder)
                                .andExpect(status().isCreated())
                                .andReturn();

                String responseBody = result.getResponse().getContentAsString();
                Sector ActualSector = objectMapper.readValue(responseBody, Sector.class);
                assertTrue(1 == ActualSector.getId());

        }

        @Test
        @WithMockUser("PLAYER")
        void cantCreateSector_BadRequest() throws Exception {

                Sector sector = new Sector();
                sector.setId(-1);
                sector.setNumber(3);
                sector.setScrap(false);
                sector.setLines(null);
                sector.setGame(null);

                objectMapper = new ObjectMapper();
                when(sectorService.save(any(Sector.class))).thenAnswer(i -> i.getArguments()[0]);
                String json = objectMapper.writeValueAsString(sector);

                MockHttpServletRequestBuilder requestBuilder = post("/api/v1/sectors")
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
        void canGetSectorById() throws Exception {
                Integer sectorId = 1;
                when(sectorService.getSectorById(sectorId)).thenReturn(java.util.Optional.of(sector1));

                MockHttpServletRequestBuilder request = get("/api/v1/sectors/{id}", sectorId).with(csrf());

                mockMvc.perform(request).andExpect(status().isOk())
                                .andExpect(jsonPath("$.id").value(sectorId));
        }

        @Test
        @WithMockUser("PLAYER")
        void cantGetSectorById_NotFound() throws Exception {

                Integer nonExistenSectorId = 33;

                when(sectorService.getSectorById(nonExistenSectorId)).thenThrow(ResourceNotFoundException.class);

                MockHttpServletRequestBuilder request = get("/api/v1/sectors/{id}", nonExistenSectorId).with(csrf());

                mockMvc.perform(request).andExpect(status().isNotFound());
        }

        @Test
        @WithMockUser("PLAYER")
        void canUpdateSector() throws Exception {

                Integer sector1Id = 1;

                sector1.setScrap(true);

                when(sectorService.getSectorById(sector1Id)).thenReturn(Optional.of(sector1));
                when(sectorService.save(sector1)).thenReturn(sector1);
                String json = objectMapper.writeValueAsString(sector1);

                MockHttpServletRequestBuilder requestBuilder = put("/api/v1/sectors/{id}", sector1Id)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json)
                                .with(csrf());

                mockMvc.perform(requestBuilder)
                                .andExpect(status().isNoContent());
        }

        @Test
        @WithMockUser("PLAYER")
        void cantUpdateSector_NotFound() throws Exception {
                Integer nonExistendSectorId = 20;

                sector1.setScrap(true);

                when(sectorService.getSectorById(nonExistendSectorId)).thenThrow(ResourceNotFoundException.class);
                when(sectorService.save(sector1)).thenReturn(sector1);
                String json = objectMapper.writeValueAsString(sector1);

                MockHttpServletRequestBuilder requestBuilder = put("/api/v1/sectors/{id}", nonExistendSectorId)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json)
                                .with(csrf());

                mockMvc.perform(requestBuilder)
                                .andExpect(status()
                                                .isNotFound());
        }

        @Test
        @WithMockUser("PLAYER")
        void canDeleteSector() throws Exception {
                Integer sectorId = 1;

                ObjectMapper objectMapper = new ObjectMapper();

                when(sectorService.getSectorById(sectorId)).thenReturn(Optional.of(sector1));
                doNothing().when(sectorService).delete(sectorId);

                String json = objectMapper.writeValueAsString(sector1);

                MockHttpServletRequestBuilder requestBuilder = delete("/api/v1/sectors/{id}", sectorId)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json)
                                .with(csrf());

                mockMvc.perform(requestBuilder).andExpect(status().isNoContent());
        }

        @Test
        @WithMockUser("PLAYER")
        void cantDeleteSector_NotFound() throws Exception {
                Integer sectorId = 1;
                Integer nonExistendSectorId = 20;

                ObjectMapper objectMapper = new ObjectMapper();

                when(sectorService.getSectorById(nonExistendSectorId)).thenThrow(ResourceNotFoundException.class);
                doNothing().when(sectorService).delete(sectorId);

                String json = objectMapper.writeValueAsString(sector1);

                MockHttpServletRequestBuilder requestBuilder = delete("/api/v1/sectors/{id}", sectorId)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json)
                                .with(csrf());

                mockMvc.perform(requestBuilder).andExpect(status().isNotFound());
        }

        @Test
        @WithMockUser("PLAYER")
        void canDeleteSectorByGameId() throws Exception {
                Integer gameId = 1;
                Game game1 = new Game();
                game1.setId(gameId);

                Sector sectorTest = new Sector();
                sectorTest.setId(3);
                sectorTest.setGame(game1);

                when(sectorService.getAllSectorsByGameId(gameId)).thenReturn(List.of(sectorTest));
                doNothing().when(sectorService).deleteByGameId(gameId);


                MockHttpServletRequestBuilder requestBuilder = delete("/api/v1/sectors?gameid={gameId}", gameId)
                                .contentType(MediaType.APPLICATION_JSON)
                                .with(csrf());

                mockMvc.perform(requestBuilder)
                                .andExpect(status().isNoContent());
        }

        @Test
        @WithMockUser("PLAYER")
        void cantDeleteSectorByGameId() throws Exception {

                Integer nonExistendSectorId = 33;

                when(sectorService.getAllSectorsByGameId(nonExistendSectorId)).thenReturn(List.of());
                doNothing().when(sectorService).deleteByGameId(nonExistendSectorId);

                MockHttpServletRequestBuilder requestBuilder = delete("/api/v1/sectors?gameid={nonExistendGameId}", nonExistendSectorId)
                                .contentType(MediaType.APPLICATION_JSON)
                                .with(csrf());

                mockMvc.perform(requestBuilder)
                                .andExpect(status().isNotFound());
        }

}
