package org.springframework.samples.petclinic.game;

import java.net.URI;
import java.util.List;
import java.util.Optional;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.samples.petclinic.exceptions.ResourceNotFoundException;
import org.springframework.samples.petclinic.player.Player;
import org.springframework.samples.petclinic.player.PlayerService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Sort;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/api/v1/games")
@Tag(name = "Games", description = "API for the  management of Games, only the users athenticated as players or admins can acces to the methods below")
@SecurityRequirement(name = "bearerAuth")
public class GameRestController {
    
    @Autowired
    GameService gs;

    @Autowired
    PlayerService ps;

    @Autowired
    public GameRestController(GameService gs, PlayerService ps) {
        this.gs = gs;
        this.ps = ps;
    }

    @Operation(summary = "returns the list of created games", description = " you can give a status or playerId to filter the returned games")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "200", description = "the given parameter was correct or the method can return all of the existent games"),
            @ApiResponse(responseCode = "404", description = " the given parameters are not associated to any existent game"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method")

    })
    @GetMapping
    public ResponseEntity<List<Game>> getAllGames(
            @ParameterObject @RequestParam(value = "status", required = false) GameStatus status,
            @ParameterObject @RequestParam(value = "playerId", required = false) Integer playerId,
            @RequestParam(required = false) String order,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "7") int size) {
        Pageable paging;
        if (order != null) {
            if (order.startsWith("-"))
                paging = PageRequest.of(page, size, Sort.by(order.substring(1)).descending());
            else
                paging = PageRequest.of(page, size, Sort.by(order).ascending());
        } else {
            paging = PageRequest.of(page, size);
        }

        if (status != null) {
            switch (status) {
                case WAITING:
                    return new ResponseEntity<>((List<Game>) gs.getWaitingGames(paging), HttpStatus.OK);
                case PLAYING:
                    return new ResponseEntity<>((List<Game>) gs.getOngoingGames(paging), HttpStatus.OK);
                default:
                    return new ResponseEntity<>((List<Game>) gs.getFinishedGames(paging), HttpStatus.OK);
            }
        } else if (status == null && playerId != null) {
            return new ResponseEntity<>((List<Game>) gs.getGamesByPlayerId(paging, playerId), HttpStatus.OK);
        } else
            return new ResponseEntity<>((List<Game>) gs.getAllGames(paging), HttpStatus.OK);
    }

    @Operation(summary = "returns the game that matches the given id")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "200", description = "the given parameter was correct"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),
            @ApiResponse(responseCode = "404", description = " the given id is not associated to any crewmates")

    })
    @GetMapping("/{id}")
    public Game getGameById(@PathVariable("id") Integer id) {
        Optional<Game> g = gs.getGameById(id);
        if (!g.isPresent())
            throw new ResourceNotFoundException("Game", "id", id);
        return g.get();
    }

    @Operation(summary = "returns the created game", description = "you need to be authenticated as a player, and the body of the request must be valid and match the restrictions and annotations defined")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "201", description = "the game has been created"),
            @ApiResponse(responseCode = "400", description = "the request couldnt be done because the given game is not valid"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),

    })
    @PostMapping()
    public ResponseEntity<Game> createGame(@Valid @RequestBody Game g) {
        g = gs.save(g);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(g.getId())
                .toUri();
        return ResponseEntity.created(location).body(g);
    }

    @Operation(summary = "this method updates the game ", description = "the given game must be valid")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "204", description = "game has been updated"),
            @ApiResponse(responseCode = "400", description = "the request couldnt be done because the given game is not valid"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),
            @ApiResponse(responseCode = "404", description = "the given id is not associated to any game")

    })
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateGame(@Valid @RequestBody Game g, @PathVariable("id") Integer id) {
        Game gToUpdate = getGameById(id);

        BeanUtils.copyProperties(g, gToUpdate, "id");
        gs.save(gToUpdate);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "this method deletes the game that matches the id")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "204", description = "the given id was correct and the game was deleted"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),
            @ApiResponse(responseCode = "404", description = " the given id is not associated to any game")

    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGame(@PathVariable("id") Integer id) {
        if (getGameById(id) != null)
            gs.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "this method adds the player that matches playerId to the game that matches the given id")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "200", description = "the parameters were correct and the player was added to the game"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),
            @ApiResponse(responseCode = "404", description = " the id parameters are not associated to any game or any player")

    })
    @PatchMapping("/{id}/addPlayer")
    public ResponseEntity<Game> addPlayer(@PathVariable("id") Integer id, @RequestParam("playerid") Integer playerid) {
        Game g = getGameById(id);
        Player p = ps.findPlayerById(playerid);
        g = gs.addPlayer(g, p);
        return ResponseEntity.ok(g);
    }

    @Operation(summary = "this method updates the game that matches the id setting the next active player in the game, if lastRound is given the previous active player wont be able to play the next round ")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "204", description = "the given id was correct and next active player has been selected"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),
            @ApiResponse(responseCode = "404", description = " the given ids  are not related to a game or player")

    })
    @PatchMapping("/{id}/nextTurn")
    public ResponseEntity<Game> nextTurn(@PathVariable("id") Integer id,
            @RequestParam(value = "lastRound", required = false, defaultValue = "false") Boolean lastRound) {
        Game g = getGameById(id);
        g = gs.nextTurn(g, lastRound);
        return ResponseEntity.ok(g);
    }

    @Operation(summary = "this method sets the game that matches the id as finished and sets the finish Date")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "204", description = "the given id was correct and the game was set to finish"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),
            @ApiResponse(responseCode = "404", description = " the given id is not associated to any game")

    })
    @PatchMapping("/{id}/finish")
    public ResponseEntity<Void> finishGame(@PathVariable("id") Integer id) {
        Game g = getGameById(id);
        gs.finishGame(g);
        return ResponseEntity.noContent().build();
    }
}