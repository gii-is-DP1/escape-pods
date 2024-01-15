package org.springframework.samples.petclinic.beacon;

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
@RequestMapping("/api/v1/beacons")
@Tag(name = "Beacons", description = "API for the  management of  Beacons, only authenticated users can access the methods below")
@SecurityRequirement(name = "bearerAuth")
public class BeaconRestController {
    BeaconService bs;

    @Autowired
    public BeaconRestController(BeaconService bs) {
        this.bs = bs;
    }

    @Operation(summary = "returns the list of the created beacons ", description = " you can give a gameId or a color to filter the returned beacons")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "200", description = "the given parameters were correct"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),
            @ApiResponse(responseCode = "404", description = " the given gameId is not associated to any existent game")

    })
    @GetMapping
    public List<Beacon> getAllBeacons(@ParameterObject() @RequestParam(value = "color", required = false) String color1,
            @ParameterObject @RequestParam(value = "gameid", required = false) Integer gameid) {
        if (color1 != null) {
            return bs.getBeaconByColor(color1);
        }
        if (gameid != null) {
            return bs.getBeaconsByGameId(gameid);
        } else
            return bs.getAllBeacons();
    }

    @Operation(summary = "returns the beacon that macthes the given id")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "200", description = "the given parameters were correct"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),
            @ApiResponse(responseCode = "404", description = " the given id is not associated to any beacon")

    })
    @GetMapping("/{id}")
    public Beacon getBeaconById(@PathVariable("id") Integer id) {
        Optional<Beacon> b = bs.getBeaconById(id);
        if (!b.isPresent())
            throw new ResourceNotFoundException("Beacon", "id", id);
        return b.get();
    }

    @Operation(summary = "returns the created beacon", description = "the body of the request must be valid and match the restrictions and annotations defined")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "201", description = "the beacon has been created"),
            @ApiResponse(responseCode = "400", description = "the request couldnt be done because the given beacon is not valid"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),

    })
    @PostMapping
    public ResponseEntity<Beacon> createBeacon(@Valid @RequestBody Beacon b) {
        b = bs.save(b);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(b.getId())
                .toUri();
        return ResponseEntity.created(location).body(b);
    }

    @Operation(summary = "this method updates the beacon ", description = "although this method exists, in the game context we never need to update the beacon")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "204", description = "beacon has been updated"),
            @ApiResponse(responseCode = "400", description = "the request couldnt be done because the given beacon is not valid"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),
            @ApiResponse(responseCode = "404", description = " the given id is not associated to any beacon")

    })
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateBeacon(@Valid @RequestBody Beacon b, @PathVariable("id") Integer id) {
        Beacon gToUpdate = getBeaconById(id);
        BeanUtils.copyProperties(b, gToUpdate, "id");
        bs.save(gToUpdate);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "this method deletes the beacon that matches the id")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "204", description = "the given id was correct and the beacon was deleted"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),
            @ApiResponse(responseCode = "404", description = " the given id is not associated to any beacon")

    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBeacon(@PathVariable("id") Integer id) {
        if (getBeaconById(id) != null)
            bs.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "this method deletes the beacon that matches the given game id ")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "204", description = "the given id was correct and the beacons associated to the game were deleted"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),
            @ApiResponse(responseCode = "404", description = " the given game id is not associated to any beacon")

    })
    @DeleteMapping()
    public ResponseEntity<Void> deleteBeaconsById(
            @ParameterObject @RequestParam(value = "gameid", required = false) Integer gameid) {
        bs.deleteByGameId(gameid);
        return ResponseEntity.noContent().build();
    }

}
