package org.springframework.samples.petclinic.shelterCard;

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
@RequestMapping("/api/v1/shelterCards")
@Tag(name = "ShelterCards", description = "API for the  management of ShelterCards.")
@SecurityRequirement(name = "bearerAuth")
public class ShelterCardController {
    
    ShelterCardService scs;

    @Autowired
    public ShelterCardController(ShelterCardService scs) {
        this.scs = scs;
    }

    @Operation(summary = "returns the list of shelterCards that have been created", description = " you can give a gameId to filter the returned lines or a parameter scrap to get the shelterCards that have been scrapped")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "200", description = "the given parameter was correct or the method can return all of the existent shelterCards"),
            @ApiResponse(responseCode = "404", description = " the gameId given is not associated to any existent game"),
            @ApiResponse(responseCode = "400", description = " the scrap parameter is not a boolean or the gameid is not an integer"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),
            

    })

    @GetMapping
    public List<ShelterCard> getAllShelterCards(
            @ParameterObject @RequestParam(value = "status", required = false) Type type,
            @ParameterObject @RequestParam(value = "gameid", required = false) Integer gameid) {
        if (type != null) {
            switch (type) {
                case PINK:
                    return scs.getShelterCardByType(Type.PINK);
                case YELLOW:
                    return scs.getShelterCardByType(Type.YELLOW);
                case BLUE:
                    return scs.getShelterCardByType(Type.BLUE);
                case ORANGE:
                    return scs.getShelterCardByType(Type.ORANGE);
                default:
                    return scs.getShelterCardByType(Type.GREEN);
            }
        } else if (type == null && gameid != null) {
            return scs.getShelterCardByGameId(gameid);
        }
        return scs.getAllShelterCards();
    }

    @Operation(summary = "returns the shelterCard that matches the given id")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "200", description = "the given parameter was correct"),
            @ApiResponse(responseCode = "404", description = " the given id is not associated to any shelterCard"),
            @ApiResponse(responseCode = "400", description = " the id is not an integer"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),

    })

    @GetMapping("/{id}")
    public ShelterCard getShelterCardById(@PathVariable("id") Integer id) {
        Optional<ShelterCard> g = scs.getShelterCardById(id);
        if (!g.isPresent())
            throw new ResourceNotFoundException("ShelterCard", "id", id);
        return g.get();
    }

    @Operation(summary = "the method creates a shelterCard", description = " the entity shelterCard must be given correctly")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "201", description = "the shelterCard has been created"),
            @ApiResponse(responseCode = "400", description = " the shelterCard given is not valid"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),

    })

    @PostMapping()
    public ResponseEntity<ShelterCard> createShelterCard(@Valid @RequestBody ShelterCard g) {
        g = scs.save(g);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(g.getId())
                .toUri();
        return ResponseEntity.created(location).body(g);
    }

    @Operation(summary = "the method updates a shelterCard from a id", description = " the entity shelterCard must be given correctly as the id")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "204", description = "the shelterCard has beeen updated"),
            @ApiResponse(responseCode = "404", description = " the shelterCardId given is not associated to any existent shelterCard"),
            @ApiResponse(responseCode = "400", description = " the id is not an integer or the shelterCard given is not valid"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),

    })

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateShelterCard(@Valid @RequestBody ShelterCard g, @PathVariable("id") Integer id) {
        ShelterCard gToUpdate = getShelterCardById(id);
        BeanUtils.copyProperties(g, gToUpdate, "id");
        scs.save(gToUpdate);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "the method deletes a shelterCard", description = " you must give a valid id to delete the shelterCard you want")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "204", description = "the shelterCard has been deleted"),
            @ApiResponse(responseCode = "404", description = " the shelterCardId given is not associated to any existent shelterCard"),
            @ApiResponse(responseCode = "400", description = " the id is not an integer"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),

    })

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShelterCard(@PathVariable("id") Integer id) {
        if (getShelterCardById(id) != null)
            scs.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    @Operation(summary = "deletes the shelterCards that are associated to the given gameid", description = " you must give a valid gameid to delete the shelterCards you want")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "204", description = "the shelterCards have been deleted"),
            @ApiResponse(responseCode = "404", description = " the given id is not associated to any game"),
            @ApiResponse(responseCode = "400", description = " the id is not an integer"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),

    })

    @DeleteMapping()
    public ResponseEntity<Void> deleteShelterCardsByGameId(
            @ParameterObject @RequestParam(value = "gameid", required = false) Integer gameid) {
                if(scs.getShelterCardByGameId(gameid).size()==0){
                    return ResponseEntity.notFound().build();
                }
        scs.deleteByGameId(gameid);
        return ResponseEntity.noContent().build();
    }

}
