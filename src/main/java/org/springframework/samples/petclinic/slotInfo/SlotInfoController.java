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

    @GetMapping
    public List<SlotInfo> getAllSlotInfos(@ParameterObject @RequestParam(value = "gameid", required = false) Integer gameid) {
        if (gameid != null) {
            return sis.getSlotInfoByGameId(gameid);
        } else {
            return sis.getAllSlotInfos();
        }

    }

    @GetMapping("/{id}")
    public SlotInfo getSlotInfoById(@PathVariable("id") Integer id) {
        Optional<SlotInfo> g = sis.getSlotInfoById(id);
        if (!g.isPresent())
            throw new ResourceNotFoundException("SlotInfo", "id", id);
        return g.get();
    }

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

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateSlotInfo(@Valid @RequestBody SlotInfo g, @PathVariable("id") Integer id) {
        SlotInfo gToUpdate = getSlotInfoById(id);
        BeanUtils.copyProperties(g, gToUpdate, "id");
        sis.save(gToUpdate);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSlotInfo(@PathVariable("id") Integer id) {
        if (getSlotInfoById(id) != null)
            sis.delete(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping()
    public ResponseEntity<Void> deleteSlotInfoByGameId(
            @ParameterObject @RequestParam(value = "gameid", required = false) Integer gameid) {
        sis.deleteByGameId(gameid);
        return ResponseEntity.noContent().build();
    }

}
