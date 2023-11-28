package org.springframework.samples.petclinic.player;

import java.net.URISyntaxException;
import java.net.http.HttpResponse;
import java.util.List;

import org.apache.tomcat.util.http.parser.HttpParser;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.samples.petclinic.auth.payload.response.MessageResponse;
import org.springframework.samples.petclinic.owner.Owner;
import org.springframework.samples.petclinic.user.User;
import org.springframework.samples.petclinic.user.UserService;
import org.springframework.samples.petclinic.util.RestPreconditions;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/players")
@SecurityRequirement(name = "bearerAuth")
public class PlayerRestController {

	private final PlayerService playerService;
	private final UserService userService;

	@Autowired
	public PlayerRestController(PlayerService playerService, UserService userService) {
		this.playerService = playerService;
		this.userService = userService;
	}

	@GetMapping
	public ResponseEntity<List<Player>> getAllPlayers(
			@RequestParam(value = "username", required = false) String username) {
		if (username == null) {
			return new ResponseEntity<>((List<Player>) playerService.findAll(), HttpStatus.OK);

		} else {
			return new ResponseEntity<>((List<Player>) playerService.findPlayerByUsername(username), HttpStatus.OK);
		}

	}

	@GetMapping(value = "/{id}")
	public ResponseEntity<Player> findById(@PathVariable("id") int id) {
		return new ResponseEntity<>(playerService.findPlayerById(id), HttpStatus.OK);
	}

	@GetMapping(value = "/{id}/username")
	public ResponseEntity<String> findUsernameByPlayerId(@PathVariable("id") int id) {
		return new ResponseEntity<>(playerService.findPlayerById(id).getUser().getUsername(), HttpStatus.OK);
	}

	@PostMapping()
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<Player> create(@RequestBody @Valid Player player) throws URISyntaxException {
		Player newPlayer = new Player();
		BeanUtils.copyProperties(player, newPlayer, "id");
		User user = userService.findCurrentUser();
		newPlayer.setUser(user);
		Player savedPlayer = this.playerService.savePlayer(newPlayer);

		return new ResponseEntity<>(savedPlayer, HttpStatus.CREATED);
	}

	@PutMapping(value = "{playerId}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<Player> update(@PathVariable("playerId") int playerId, @RequestBody @Valid Player player) {
		RestPreconditions.checkNotNull(playerService.findPlayerById(playerId), "Player", "ID", playerId);
		return new ResponseEntity<>(this.playerService.updatePlayer(player, playerId), HttpStatus.OK);
	}

	@DeleteMapping(value = "{playerId}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<MessageResponse> delete(@PathVariable("playerId") int id) {
		RestPreconditions.checkNotNull(playerService.findPlayerById(id), "Player", "ID", id);
		playerService.deletePlayer(id);
		return new ResponseEntity<>(new MessageResponse("Player deleted!"), HttpStatus.OK);
	}

}
