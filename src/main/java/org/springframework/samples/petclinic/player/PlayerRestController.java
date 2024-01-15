package org.springframework.samples.petclinic.player;

import java.net.URISyntaxException;
import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.samples.petclinic.auth.payload.response.MessageResponse;
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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/players")
@Tag(name = "Players", description = "API for the  management of Players, Only users authenticated as players or admins can access to the methods below")
@SecurityRequirement(name = "bearerAuth")
public class PlayerRestController {

	private final PlayerService playerService;
	private final UserService userService;

	@Autowired
	public PlayerRestController(PlayerService playerService, UserService userService) {
		this.playerService = playerService;
		this.userService = userService;
	}

	@Operation(summary = "returns the list of players that have been created", description = " you can give a username to filter the returned players")
	@ApiResponses(value = {

			@ApiResponse(responseCode = "200", description = "the given parameter was correct or the method can return all of the existent payers"),
			@ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),
			@ApiResponse(responseCode = "404", description = " the username given is not associated to any existent player")

	})
	@GetMapping
	public ResponseEntity<List<Player>> getAllPlayers(
			@RequestParam(value = "username", required = false) String username) {
		if (username == null) {
			return new ResponseEntity<>((List<Player>) playerService.findAll(), HttpStatus.OK);

		} else {
			return new ResponseEntity<>((List<Player>) playerService.findPlayerByUsername(username), HttpStatus.OK);
		}

	}

	@Operation(summary = "returns the player that matches the given id")
	@ApiResponses(value = {

			@ApiResponse(responseCode = "200", description = "the given parameter was correct"),
			@ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),
			@ApiResponse(responseCode = "404", description = " the given id is not associated to any player")

	})
	@GetMapping(value = "/{id}")
	public ResponseEntity<Player> findById(@PathVariable("id") int id) {
		return new ResponseEntity<>(playerService.findPlayerById(id), HttpStatus.OK);
	}

	@Operation(summary = "returns the created player", description = "the body of the request must be valid and match the restrictions and annotations defined")
	@ApiResponses(value = {

			@ApiResponse(responseCode = "201", description = "the player has been created"),
			@ApiResponse(responseCode = "400", description = "the request couldnt be done because the given player is not valid"),
			@ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),

	})
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

	@Operation(summary = "this method updates the player ", description = "the player line must be valid and the given id must be the same as your player if you have the 'PLAYER' role")
	@ApiResponses(value = {

			@ApiResponse(responseCode = "200", description = "the player has been updated"),
			@ApiResponse(responseCode = "400", description = "the request couldnt be done because the given player is not valid"),
			@ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),
			@ApiResponse(responseCode = "403", description = "if you want to update another player besides yourself you will need to be authenticated as an user with the 'ADMIN' role "),
			@ApiResponse(responseCode = "404", description = "the given id is not associated to any player")

	})
	@PutMapping(value = "{playerId}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<Player> update(@PathVariable("playerId") int playerId, @RequestBody @Valid Player player) {

		RestPreconditions.checkNotNull(playerService.findPlayerById(playerId), "Player", "ID", playerId);

		User user = userService.findCurrentUser();

		if (user.hasAuthority("PLAYER")) {
			if (playerId != playerService.findPlayerByUsername(user.getUsername()).get(0).getId()) {
				return new ResponseEntity<>(HttpStatus.FORBIDDEN);
			}
		}

		return new ResponseEntity<>(this.playerService.updatePlayer(player, playerId), HttpStatus.OK);

	}

	@Operation(summary = "this method deletes the player that mathces the given id ", description = "the player line must be valid and the given id must be the same as your player if you have the 'PLAYER' role")
	@ApiResponses(value = {

			@ApiResponse(responseCode = "200", description = "the player has been deleted"),
			@ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),
			@ApiResponse(responseCode = "403", description = "if you want to delete another player besides yourself you will need to be authenticated as an user with the 'ADMIN' role "),
			@ApiResponse(responseCode = "404", description = "the given id is not associated to any player")
	})
	@DeleteMapping(value = "{playerId}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<MessageResponse> delete(@PathVariable("playerId") int id) {

		RestPreconditions.checkNotNull(playerService.findPlayerById(id), "Player", "ID", id);

		User user = userService.findCurrentUser();

		if (user.hasAuthority("PLAYER")) {
			if ((id != playerService.findPlayerByUsername(user.getUsername()).get(0).getId())) {
				return new ResponseEntity<>(
						new MessageResponse("You can only k**l yourself!"),
						HttpStatus.FORBIDDEN);
			}
		}
		playerService.deletePlayer(id);

		return new ResponseEntity<>(new MessageResponse("Player deleted!"), HttpStatus.OK);
	}

}
