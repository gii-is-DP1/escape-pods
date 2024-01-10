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

    @GetMapping("/{id}")
    public ShelterCard getShelterCardById(@PathVariable("id") Integer id) {
        Optional<ShelterCard> g = scs.getShelterCardById(id);
        if (!g.isPresent())
            throw new ResourceNotFoundException("ShelterCard", "id", id);
        return g.get();
    }

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

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateShelterCard(@Valid @RequestBody ShelterCard g, @PathVariable("id") Integer id) {
        ShelterCard gToUpdate = getShelterCardById(id);
        BeanUtils.copyProperties(g, gToUpdate, "id");
        scs.save(gToUpdate);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShelterCard(@PathVariable("id") Integer id) {
        if (getShelterCardById(id) != null)
            scs.delete(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping()
    public ResponseEntity<Void> deleteShelterCardsByGameId(
            @ParameterObject @RequestParam(value = "gameid", required = false) Integer gameid) {
        scs.deleteByGameId(gameid);
        return ResponseEntity.noContent().build();
    }

}
