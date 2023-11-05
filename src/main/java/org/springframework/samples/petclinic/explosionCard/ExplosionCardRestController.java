package org.springframework.samples.petclinic.explosionCard;

import java.net.URI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@Controller
@RequestMapping("api/v1/ExplosionCard")
@Tag(name="Explosion Cards", description= "API for the  management of explosion Cards. ")
@SecurityRequirement(name = "bearerAuth")
public class ExplosionCardRestController {
    ExplosionCardService ecs;

    @Autowired
    public ExplosionCardRestController(ExplosionCardService ecs){
        this.ecs=ecs;
    }

    @PostMapping()
    public ResponseEntity<@Valid ExplosionCard> createExplosionCard(@Valid @RequestBody ExplosionCard ec){
        ec=ecs.save(ec);
        URI location = ServletUriComponentsBuilder
                    .fromCurrentRequest()
                    .path("/{id}")
                    .buildAndExpand(ec.getId())
                    .toUri();
        return ResponseEntity.created(location).body(ec);
    }
}
