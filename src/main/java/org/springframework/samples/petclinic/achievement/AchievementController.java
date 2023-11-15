package org.springframework.samples.petclinic.achievement;


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
@RequestMapping("/api/v1/achievement")
@Tag(name = "Achievements", description = "API for the  management of Achievements.")
@SecurityRequirement(name = "bearerAuth")
public class AchievementController {
    AchievementService as;

    @Autowired
    public AchievementController(AchievementService as){
        this.as=as;
    }

    @GetMapping
    public List<Achievement> getAllAchievements(@ParameterObject @RequestParam(value="status",required = false) String name){
        if(name!=null){
            return as.getAchievementByName(name);
        }else 
            return as.getAllAchievements();
    }

    @GetMapping("/{id}")
    public Achievement getAchievementById(@PathVariable("id")Integer id){
        Optional<Achievement> g=as.getAchievementById(id);
        if(!g.isPresent())
            throw new ResourceNotFoundException("Achievement", "id", id);
        return g.get();
    }

    @PostMapping()
    public ResponseEntity<Achievement> createAchievement(@Valid @RequestBody Achievement g){
        g=as.save(g);
        URI location = ServletUriComponentsBuilder
                    .fromCurrentRequest()
                    .path("/{id}")
                    .buildAndExpand(g.getId())
                    .toUri();
        return ResponseEntity.created(location).body(g);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateAchievement(@Valid @RequestBody Achievement g,@PathVariable("id")Integer id){
        Achievement gToUpdate=getAchievementById(id);
        BeanUtils.copyProperties(g,gToUpdate, "id");
        as.save(gToUpdate);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAchievement(@PathVariable("id")Integer id){
        if(getAchievementById(id)!=null)
            as.delete(id);
        return ResponseEntity.noContent().build();
    }
      
    
}
