package org.springframework.samples.petclinic.pods;

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
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/pods")
@Tag(name = "Podss", description = "API for the  management of Podss.")
@SecurityRequirement(name = "bearerAuth")
public class PodController {
    PodService ps;

    @Autowired
    public PodController(PodService ps){
        this.ps=ps;
    }

    @GetMapping
    public List<Pod> getAllPodss(@ParameterObject @RequestParam(value="status",required = false) Integer capacity){
        if(capacity!=null){
            return ps.getPodsByCapacity(capacity);
            } 
            return ps.getAllPodss();
    }

    @GetMapping("/{id}")
    public Pod getPodsById(@PathVariable("id")Integer id){
        Optional<Pod> g=ps.getPodsById(id);
        if(!g.isPresent())
            throw new ResourceNotFoundException("Pods", "id", id);
            
        return g.get();
    }

    @PostMapping()
    public ResponseEntity<Pod> createPods(@Valid @RequestBody Pod g){
        g=ps.save(g);
        URI location = ServletUriComponentsBuilder
                    .fromCurrentRequest()
                    .path("/{id}")
                    .buildAndExpand(g.getId())
                    .toUri();
        return ResponseEntity.created(location).body(g);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updatePods(@Valid @RequestBody Pod g,@PathVariable("id")Integer id){
        Pod gToUpdate=getPodsById(id);
        BeanUtils.copyProperties(g,gToUpdate, "id");
        ps.save(gToUpdate);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePods(@PathVariable("id")Integer id){
        if(getPodsById(id)!=null)
            ps.delete(id);
        return ResponseEntity.noContent().build();
    }
       
}
