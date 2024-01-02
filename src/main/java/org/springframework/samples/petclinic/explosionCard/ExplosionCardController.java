package org.springframework.samples.petclinic.explosionCard;

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

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/explosionCards")
@Tag(name = "ExplosionCards", description = "API for the  management of ExplosionCards.")
@SecurityRequirement(name = "bearerAuth")
public class ExplosionCardController {
    ExplosionCardService ecs;

    @Autowired
    public ExplosionCardController(ExplosionCardService ecs){
        this.ecs=ecs;
    }

    @GetMapping
    public List<ExplosionCard> getAllExplosionCards(@ParameterObject @RequestParam(value="status",required = false) Integer number,
    @ParameterObject @RequestParam(value = "gameid", required = false) Integer gameid){
        if(number!=null){
            return ecs.getExplosionCardByNumber(number);
        } if (gameid!=null) {
            return ecs.getExplosionCardByGameId(gameid);
        } else{
        return ecs.getAllExplosionCards();
        }
    
    }

    @GetMapping("/{id}")
    public ExplosionCard getExplosionCardById(@PathVariable("id")Integer id){
        Optional<ExplosionCard> g=ecs.getExplosionCardById(id);
        if(!g.isPresent())
            throw new ResourceNotFoundException("ExplosionCard", "id", id);
        return g.get();
    }

    @PostMapping()
    public ResponseEntity<ExplosionCard> createExplosionCard(@Valid @RequestBody ExplosionCard g){
        g=ecs.save(g);
        URI location = ServletUriComponentsBuilder
                    .fromCurrentRequest()
                    .path("/{id}")
                    .buildAndExpand(g.getId())
                    .toUri();
        return ResponseEntity.created(location).body(g);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateExplosionCard(@Valid @RequestBody ExplosionCard g,@PathVariable("id")Integer id){
        ExplosionCard gToUpdate=getExplosionCardById(id);
        BeanUtils.copyProperties(g,gToUpdate, "id");
        ecs.save(gToUpdate);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExplosionCard(@PathVariable("id")Integer id){
        if(getExplosionCardById(id)!=null)
            ecs.delete(id);
        return ResponseEntity.noContent().build();
    }
    
}