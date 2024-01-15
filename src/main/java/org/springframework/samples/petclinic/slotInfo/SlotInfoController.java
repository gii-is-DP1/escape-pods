package org.springframework.samples.petclinic.slotInfo;

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
@RequestMapping("/api/v1/slotInfos")
@Tag(name = "SlotInfos", description = "API for the  management of SlotInfos.")
@SecurityRequirement(name = "bearerAuth")
public class SlotInfoController {
    SlotInfoService sis;

    @Autowired
    public SlotInfoController(SlotInfoService sis) {
        this.sis = sis;
    }

    @Operation(summary = "returns the list of slotInfos that have been created", description = " you can give a gameId to filter the returned lines or a parameter scrap to get the slotInfos that have been scrapped")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "200", description = "the given parameter was correct or the method can return all of the existent slotInfos"),
            @ApiResponse(responseCode = "404", description = " the gameId given is not associated to any existent game"),
            @ApiResponse(responseCode = "400", description = " the scrap parameter is not a boolean or the gameid is not an integer"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),
            

    })

    @GetMapping
    public List<SlotInfo> getAllSlotInfos(
            @ParameterObject @RequestParam(value = "gameid", required = false) Integer gameid) {
        if (gameid != null) {
            return sis.getSlotInfoByGameId(gameid);
        } else {
            return sis.getAllSlotInfos();
        }

    }

    @Operation(summary = "returns the slotInfo that matches the given id")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "200", description = "the given parameter was correct"),
            @ApiResponse(responseCode = "404", description = " the given id is not associated to any slotInfo"),
            @ApiResponse(responseCode = "400", description = " the id is not an integer"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),

    })

    @GetMapping("/{id}")
    public SlotInfo getSlotInfoById(@PathVariable("id") Integer id) {
        Optional<SlotInfo> g = sis.getSlotInfoById(id);
        if (!g.isPresent())
            throw new ResourceNotFoundException("SlotInfo", "id", id);
        return g.get();
    }

    @Operation(summary = "the method creates a slotInfo", description = " the entity slotInfo must be given correctly")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "201", description = "the slotInfo has been created"),
            @ApiResponse(responseCode = "400", description = " the slotInfo given is not valid"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),

    })

    @PostMapping()
    public ResponseEntity<SlotInfo> createSlotInfo(@Valid @RequestBody SlotInfo g) {
        g = sis.save(g);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(g.getId())
                .toUri();
        return ResponseEntity.created(location).body(g);
    }

    @Operation(summary = "the method updates a slotInfo from a id", description = " the entity slotInfo must be given correctly as the id")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "204", description = "the slotInfo has beeen updated"),
            @ApiResponse(responseCode = "404", description = " the slotInfoId given is not associated to any existent slotInfo"),
            @ApiResponse(responseCode = "400", description = " the id is not an integer or the slotInfo given is not valid"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),

    })

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateSlotInfo(@Valid @RequestBody SlotInfo g, @PathVariable("id") Integer id) {
        SlotInfo gToUpdate = getSlotInfoById(id);
        BeanUtils.copyProperties(g, gToUpdate, "id");
        sis.save(gToUpdate);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "the method deletes a slotInfo", description = " you must give a valid id to delete the slotInfo you want")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "204", description = "the slotInfo has been deleted"),
            @ApiResponse(responseCode = "404", description = " the slotInfoId given is not associated to any existent slotInfo"),
            @ApiResponse(responseCode = "400", description = " the id is not an integer"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),

    })

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSlotInfo(@PathVariable("id") Integer id) {
        if (getSlotInfoById(id) != null)
            sis.delete(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping()
    public ResponseEntity<Void> deleteSlotInfoByGameId(
            @ParameterObject @RequestParam(value = "gameid", required = false) Integer gameid) {

                if(sis.getSlotInfoByGameId(gameid).size()==0){
                    return ResponseEntity.notFound().build();
                }
        sis.deleteByGameId(gameid);
        return ResponseEntity.noContent().build();
    }

}
