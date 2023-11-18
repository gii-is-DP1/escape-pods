package org.springframework.samples.petclinic.player;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.samples.petclinic.owner.Owner;
import org.springframework.samples.petclinic.user.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/v1/players")
@SecurityRequirement(name = "bearerAuth")
public class PlayerRestController {

    /*private final PlayerService playerService;
	private final UserService userService;

    @Autowired
	public PlayerRestController(PlayerService playerService, UserService userService) {
		this.playerService = playerService;
		this.userService = userService;
	}

    @GetMapping
	public ResponseEntity<List<Player>> findAll() {
		return new ResponseEntity<>((List<Player>) playerService.findAll(), HttpStatus.OK);
	}*/
    
}
