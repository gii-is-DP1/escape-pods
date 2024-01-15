package org.springframework.samples.petclinic.pod;

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
@RequestMapping("/api/v1/pods")
@Tag(name = "Pods", description = "API for the  management of Pods.")
@SecurityRequirement(name = "bearerAuth")
public class PodController {
    PodService ps;

    @Autowired
    public PodController(PodService ps) {
        this.ps = ps;
    }

    @Operation(summary = "returns the list of pods that have been created", description = " you can give a gameId, or capacity to filter the returned lines")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "200", description = "the given parameter was correct or the method can return all of the existent lines"),
            @ApiResponse(responseCode = "404", description = " the gameId given is not associated to any existent game or the capacity is not associated to any exsitent pod"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),
    })

    @GetMapping
    public List<Pod> getAllPods(@ParameterObject @RequestParam(value = "status", required = false) Integer capacity,
            @ParameterObject @RequestParam(value = "gameid", required = false) Integer gameid) {
        if (capacity != null) {
            return ps.getPodsByCapacity(capacity);
        }
        if (gameid != null) {
            return ps.getPodsByGameId(gameid);
        } else {
            return ps.getAllPods();
        }
    }

    @Operation(summary = "returns the pod that have the id passed", description = " you must give a valid id to get the pod you want")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "200", description = "the given parameter was correct or the method can return the pod"),
            @ApiResponse(responseCode = "404", description = " the podId given is not associated to any existent pod"),
            @ApiResponse(responseCode = "400", description = " the podId given is not a valid id"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),
    })

    @GetMapping("/{id}")
    public Pod getPodsById(@PathVariable("id") Integer id) {
        Optional<Pod> g = ps.getPodsById(id);
        if (!g.isPresent())
            throw new ResourceNotFoundException("Pods", "id", id);

        return g.get();
    }

    @Operation(summary = "this method creates a pod", description = " the entity pod must be given correctly")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "201", description = "the pod has been created"),
            @ApiResponse(responseCode = "400", description = " the request couldnt be done because the given pod is not valid"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),
    })

    @PostMapping()
    public ResponseEntity<Pod> createPods(@Valid @RequestBody Pod g) {
        g = ps.save(g);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(g.getId())
                .toUri();
        return ResponseEntity.created(location).body(g);
    }

    @Operation(summary = "this method updates a pod", description = " the entity pod must be given correctly")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "204", description = "the given parameter was correct or the method can update the pod given"),
            @ApiResponse(responseCode = "404", description = " the podId given is not associated to any existent pod"),
            @ApiResponse(responseCode = "400", description = " the request couldnt be done because the given pod is not valid"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),
    })

    @PutMapping("/{id}")
    public ResponseEntity<Void> updatePods(@Valid @RequestBody Pod g, @PathVariable("id") Integer id) {
        Pod gToUpdate = getPodsById(id);
        BeanUtils.copyProperties(g, gToUpdate, "id");
        ps.save(gToUpdate);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "this method deletes a pod from a id", description = " you can give a id to delete the pod you want")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "204", description = "the given parameter was correct or the method can delete the pod"),
            @ApiResponse(responseCode = "404", description = " the podId given is not associated to any existent pod"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),
    })

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePods(@PathVariable("id") Integer id) {
        if (getPodsById(id) != null)
            ps.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "this method deletes all pods from a game", description = " you can give a gameId to delete all the pods from that game")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "204", description = "the given parameter was correct or the method can delete the pods"),
            @ApiResponse(responseCode = "404", description = " the gameId given is not associated to any existent game"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),
    })

    @DeleteMapping()
    public ResponseEntity<Void> deletePodsByGameId(
            @ParameterObject @RequestParam(value = "gameid", required = true) Integer gameid) {
                if(ps.getPodsByGameId(gameid).size()==0){
                    return ResponseEntity.notFound().build();
                }
        ps.deleteByGameId(gameid);
        return ResponseEntity.noContent().build();
    }

}
