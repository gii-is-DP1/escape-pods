package org.springframework.samples.petclinic.gameplayer;

import java.net.URI;
import java.util.List;
import java.util.Optional;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.samples.petclinic.exceptions.ResourceNotFoundException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
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

@RestController
@RequestMapping("/api/v1/gamePlayers")
@Tag(name = "gamePlayers", description = "API for the  management of  gamePlayers, you need to be fully authenticated if you want to access the methods below")
@SecurityRequirement(name = "bearerAuth")
public class GamePlayerRestController {
    GamePlayerService ps;

    @Autowired
    public GamePlayerRestController(GamePlayerService ps) {
        this.ps = ps;
    }

    @Operation(summary = "returns the list of gamePlayers that have been created", description = " you can give a gameId to filter the returned gamePlayers")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "200", description = "the given parameter was correct or the method can return all of the existent gamePlayers"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),
            @ApiResponse(responseCode = "404", description = " the game id given is not associated to any existent game")

    })
    @GetMapping
    public List<GamePlayer> getAllGamePlayers(
            @ParameterObject() @RequestParam(value = "gameid", required = false) Integer gameid) {
        if (gameid != null) {
            return ps.getGamePlayersByGameId(gameid);
        } else
            return ps.getAllGamePlayers();
    }

    @Operation(summary = "returns the gamePlayer that matches the given id")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "200", description = "the given parameter was correct"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),
            @ApiResponse(responseCode = "404", description = " the given id is not associated to any gamePlayers")

    })
    @GetMapping("/{id}")
    public GamePlayer getGamePlayerById(@PathVariable("id") Integer id) {
        Optional<GamePlayer> p = ps.getGamePlayerById(id);
        if (!p.isPresent())
            throw new ResourceNotFoundException("gamePlayer", "id", id);
        return p.get();
    }

    @Operation(summary = "returns the created crewmate", description = "the body of the request must be valid and match the restrictions and annotations defined")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "201", description = "the crewmate has been created"),
            @ApiResponse(responseCode = "400", description = "the request couldnt be done because the given crewmate is not valid"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method")

    })
    @PostMapping()
    public ResponseEntity<GamePlayer> createGamePlayer(@Valid @RequestBody GamePlayer p) {
        p = ps.save(p);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(p.getId())
                .toUri();
        return ResponseEntity.created(location).body(p);
    }

    @Operation(summary = "this method updates the gamePlayer ", description = "the given gamePlayer must be valid")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "204", description = "gamePlayer has been updated"),
            @ApiResponse(responseCode = "400", description = "the request couldnt be done because the given gamePlayer is not valid"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),
            @ApiResponse(responseCode = "404", description = "the given id is not associated to any gamePlayer")

    })
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateGamePlayer(@Valid @RequestBody GamePlayer p, @PathVariable("id") Integer id) {
        GamePlayer pToUpdate = getGamePlayerById(id);
        BeanUtils.copyProperties(p, pToUpdate, "id");
        ps.save(pToUpdate);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "this method deletes the gamePlayer that matches the id")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "204", description = "the given id was correct and the gamePlayer was deleted"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),
            @ApiResponse(responseCode = "404", description = " the given id is not associated to any gamePlayer")

    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGamePlayer(@PathVariable("id") Integer id) {
        if (getGamePlayerById(id) != null)
            ps.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "this method deletes all of the gamePlayers that matches the given game id ")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "204", description = "the given id was correct and the gamePlayers associated to the game were deleted"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),
            @ApiResponse(responseCode = "404", description = " the given game id is not associated to any gamePlayer")

    })
    @DeleteMapping()
    public ResponseEntity<Void> deleteGamePlayersByGameId(
            @ParameterObject() @RequestParam(value = "gameid", required = false) Integer gameid) {
        ps.deleteByGameId(gameid);
        return ResponseEntity.noContent().build();
    }

}
