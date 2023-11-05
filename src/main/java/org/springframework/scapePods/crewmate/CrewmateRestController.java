package org.springframework.scapePods.crewmate;

import java.net.URI;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.samples.petclinic.exceptions.ResourceNotFoundException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/crewmate")
@Tag(name = "Crewmates", description = "API for the  management of  Crewmates.")
@SecurityRequirement(name = "bearerAuth")
public class CrewmateRestController {
    CrewmateService cs;
    @Autowired
    public CrewmateRestController(CrewmateService cs){
        this.cs=cs;
    }

    @GetMapping("/{id}")
    public Crewmate getCrewmateById(@PathVariable("id")Integer id){
        Optional<Crewmate> c=cs.getCrewmateById(id);
        if(!c.isPresent())
            throw new ResourceNotFoundException("Crewmate", "id", id);
        return c.get();
    }

    @PostMapping()
    public ResponseEntity<Crewmate> createCrewmate(@Valid @RequestBody Crewmate c){
        c=cs.save(c);
        URI location = ServletUriComponentsBuilder
                    .fromCurrentRequest()
                    .path("/{id}")
                    .buildAndExpand(c.getId())
                    .toUri();
        return ResponseEntity.created(location).body(c);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCrewmate(){
            cs.delete();
        return ResponseEntity.noContent().build();
    }

}