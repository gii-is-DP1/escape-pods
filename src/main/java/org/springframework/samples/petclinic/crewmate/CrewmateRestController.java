package org.springframework.samples.petclinic.crewmate;

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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/crewmates")
@Tag(name = "Crewmates", description = "API for the  management of  Crewmates, you need to be fully authenticated to access the methods below ")
@SecurityRequirement(name = "bearerAuth")
public class CrewmateRestController {
    CrewmateService cs;

    @Autowired
    public CrewmateRestController(CrewmateService cs) {
        this.cs = cs;
    }

    @Operation(summary = "returns the list of Crewmates that have been created", description = " you can give a gameId to filter the returned crewmates")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "200", description = "the given parameter was correct or the method can return all of the existent crewmates"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),
            @ApiResponse(responseCode = "404", description = " the gameId given is not associated to any existent game")

    })
    @GetMapping
    public List<Crewmate> getAllCrewmates(
            @ParameterObject @RequestParam(value = "gameid", required = false) Integer gameid) {
        if (gameid != null) {
            return cs.getAllCrewmatesByGameId(gameid);
        } else {
            return cs.getAllCrewmates();
        }

    }

    @Operation(summary = "returns the crewmate that matches the given id")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "200", description = "the given parameter was correct"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),
            @ApiResponse(responseCode = "404", description = " the given id is not associated to any crewmates")

    })
    @GetMapping("/{id}")
    public Crewmate getCrewmateById(@PathVariable("id") Integer id) {
        Optional<Crewmate> c = cs.getCrewmateById(id);
        if (!c.isPresent())
            throw new ResourceNotFoundException("Crewmate", "id", id);
        return c.get();
    }

    @Operation(summary = "returns the created crewmate", description = "the body of the request must be valid and match the restrictions and annotations defined")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "201", description = "the crewmate has been created"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),
            @ApiResponse(responseCode = "400", description = "the request couldnt be done because the given crewmate is not valid")

    })
    @PostMapping()
    public ResponseEntity<Crewmate> createCrewmate(@Valid @RequestBody Crewmate c) {
        c = cs.save(c);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(c.getId())
                .toUri();
        return ResponseEntity.created(location).body(c);
    }

    @Operation(summary = "this method updates the crewmate ", description = "the given crewmate must be valid")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "204", description = "crewmate has been updated"),
            @ApiResponse(responseCode = "400", description = "the request couldnt be done because the given crewmate is not valid"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),
            @ApiResponse(responseCode = "404", description = "the given id is not associated to any crewmate")

    })
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateCrewmate(@Valid @RequestBody Crewmate c, @PathVariable("id") Integer id) {
        Crewmate crewmateToUpdate = getCrewmateById(id);
        BeanUtils.copyProperties(c, crewmateToUpdate, "id");
        cs.save(crewmateToUpdate);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "this method deletes the crewmate that matches the id")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "204", description = "the given id was correct and the crewmate was deleted"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),
            @ApiResponse(responseCode = "404", description = " the given id is not associated to any crewmate")

    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCrewmate(@PathVariable("id") Integer id) {
        if (getCrewmateById(id) != null)
            cs.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "this method deletes all of the crewmates that matches the given game id ")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "204", description = "the given id was correct and the crewmates associated to the game were deleted"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),
            @ApiResponse(responseCode = "404", description = " the given game id is not associated to any crewmate")

    })
    @DeleteMapping()
    public ResponseEntity<Void> deleteCrewmatesByGameId(
            @ParameterObject @RequestParam(value = "gameid", required = true) Integer gameid) {
        cs.deleteByGameId(gameid);
        return ResponseEntity.noContent().build();
    }

}