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

    @GetMapping("/{id}")
    public Sector getSectorById(@PathVariable("id") Integer id) {
        Optional<Sector> g = scs.getSectorById(id);
        if (!g.isPresent())
            throw new ResourceNotFoundException("Sector", "id", id);

        return g.get();
    }

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

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateSector(@Valid @RequestBody Sector g, @PathVariable("id") Integer id) {
        Sector gToUpdate = getSectorById(id);
        BeanUtils.copyProperties(g, gToUpdate, "id");
        scs.save(gToUpdate);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSector(@PathVariable("id") Integer id) {
        if (getSectorById(id) != null)
            scs.delete(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping()
    public ResponseEntity<Void> deleteSectorByGameId(
            @ParameterObject @RequestParam(value = "gameid", required = false) Integer gameid) {
        scs.deleteByGameId(gameid);
        return ResponseEntity.noContent().build();
    }

}
