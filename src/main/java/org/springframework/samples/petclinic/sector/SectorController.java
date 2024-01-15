package org.springframework.samples.petclinic.sector;

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
@RequestMapping("/api/v1/sectors")
@Tag(name = "Sectors", description = "API for the  management of Sectors.")
@SecurityRequirement(name = "bearerAuth")
public class SectorController {
    SectorService scs;

    @Autowired
    public SectorController(SectorService scs) {
        this.scs = scs;
    }

    @Operation(summary = "returns the list of sectors that have been created", description = " you can give a gameId to filter the returned lines or a parameter scrap to get the sectors that have been scrapped")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "200", description = "the given parameter was correct or the method can return all of the existent sectors"),
            @ApiResponse(responseCode = "404", description = " the gameId given is not associated to any existent game"),
            @ApiResponse(responseCode = "400", description = " the scrap parameter is not a boolean or the gameid is not an integer"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),
            

    })


    @GetMapping
    public List<Sector> getAllSectors(@ParameterObject @RequestParam(value = "status", required = false) Boolean scrap,
            @ParameterObject @RequestParam(value = "gameid", required = false) Integer gameid) {
        if (scrap != null) {
            return scs.getSectorScrapped(scrap);
        } else if (scrap == null && gameid != null) {
            return scs.getAllSectorsByGameId(gameid);
        } else {
            return scs.getAllSectors();
        }
    }

    @Operation(summary = "returns the sector that matches the given id")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "200", description = "the given parameter was correct"),
            @ApiResponse(responseCode = "404", description = " the given id is not associated to any sector"),
            @ApiResponse(responseCode = "400", description = " the id is not an integer"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),

    })

    @GetMapping("/{id}")
    public Sector getSectorById(@PathVariable("id") Integer id) {
        Optional<Sector> g = scs.getSectorById(id);
        if (!g.isPresent())
            throw new ResourceNotFoundException("Sector", "id", id);

        return g.get();
    }

    @Operation(summary = "the method creates a sector", description = " the entity sector must be given correctly")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "201", description = "the sector has been created"),
            @ApiResponse(responseCode = "400", description = " the sector given is not valid"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),

    })

    @PostMapping()
    public ResponseEntity<Sector> createSector(@Valid @RequestBody Sector g) {
        g = scs.save(g);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(g.getId())
                .toUri();
        return ResponseEntity.created(location).body(g);
    }

    @Operation(summary = "the method updates a sector from a id", description = " the entity sector must be given correctly as the id")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "204", description = "the sector has beeen updated"),
            @ApiResponse(responseCode = "404", description = " the sectorId given is not associated to any existent sector"),
            @ApiResponse(responseCode = "400", description = " the id is not an integer or the sector given is not valid"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),

    })

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateSector(@Valid @RequestBody Sector g, @PathVariable("id") Integer id) {
        Sector gToUpdate = getSectorById(id);
        BeanUtils.copyProperties(g, gToUpdate, "id");
        scs.save(gToUpdate);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "the method deletes a sector", description = " you must give a valid id to delete the sector you want")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "204", description = "the sector has been deleted"),
            @ApiResponse(responseCode = "404", description = " the sectorId given is not associated to any existent sector"),
            @ApiResponse(responseCode = "400", description = " the id is not an integer"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),

    })

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSector(@PathVariable("id") Integer id) {
        if (getSectorById(id) != null)
            scs.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "deletes the sectors that are associated to the given gameid", description = " you must give a valid gameid to delete the sectors you want")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "204", description = "the sectors have been deleted"),
            @ApiResponse(responseCode = "404", description = " the given id is not associated to any game"),
            @ApiResponse(responseCode = "400", description = " the id is not an integer"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),

    })

    @DeleteMapping()
    public ResponseEntity<Void> deleteSectorsByGameId(
            @ParameterObject @RequestParam(value = "gameid", required = false) Integer gameid) {
        scs.deleteByGameId(gameid);
        return ResponseEntity.noContent().build();
    }

}
