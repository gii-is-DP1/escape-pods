package org.springframework.samples.petclinic.player;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.samples.petclinic.beacon.Beacon;
import org.springframework.samples.petclinic.user.User;
import org.springframework.samples.petclinic.user.UserService;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@WebMvcTest(PlayerRestController.class)
public class PlayerRestControllerTests {

    @MockBean
    private PlayerService playerService;

    @MockBean
    private UserService userService;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private User user1;
    private User user2;

    private Player player1;
    private Player player2;

    private List<Player> players = new ArrayList<>();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        user1 = new User();
        user1.setId(1);
        user1.setUsername("user1");
        user1.setPassword("0wn3r");
        user2 = new User();
        user2.setId(2);
        user1.setUsername("user2");
        user1.setPassword("0wn3r");

        player1 = new Player();
        player1.setId(1);
        player1.setUser(user1);
        player1.setProfileDescription("perfil de player1");
        player1.setProfilePicture("https://metricool.com/wp-content/uploads/PERFIL-TIKTOK-scaled.jpg");

        player2 = new Player();
        player2.setUser(user2);
        player2.setId(2);
        player2.setProfileDescription("jaja");
        player2.setProfilePicture("https://i.kym-cdn.com/photos/images/newsfeed/000/611/069/733.jpg");

        players.add(player1);
        players.add(player2);

    }

    @Test
    @WithMockUser("ADMIN")
    void canGetAllPlayers() throws Exception {
        List<Player> expectedPlayers = players;
        when(playerService.findAll()).thenReturn(expectedPlayers);
        MockHttpServletRequestBuilder requestBuilder = get("/api/v1/players")
                .with(csrf());

        MvcResult result = mockMvc.perform(requestBuilder)
                .andExpect(status().isOk())
                .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        List<Beacon> actualPlayers = objectMapper.readValue(responseBody, List.class);

        assertEquals(expectedPlayers.size(), actualPlayers.size());
    }
    // GRACIAS A ESTO ES COMO HEMOS CORREGIDO PLAYERRESTCONTROLLER, EL TEMA DE LOS
    // ROLES

}
