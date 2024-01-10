package org.springframework.samples.petclinic.line;

import java.net.URI;
import java.util.List;
import java.util.Optional;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
@RequestMapping("/api/v1/lines")
@Tag(name = "Lines", description = "API for the  management of Lines.")
@SecurityRequirement(name = "bearerAuth")
public class LineRestController {
    LineService ls;

    @Autowired
    public LineRestController(LineService ls) {
        this.ls = ls;

    }

    @GetMapping
    public ResponseEntity<List<Line>> getAllLines(
            @ParameterObject @RequestParam(value = "gameid", required = false) Integer gameid) {
        if (gameid != null) {
            return new ResponseEntity<>((List<Line>) ls.getAllLinesByGameId(gameid), HttpStatus.OK);
        } else
            return new ResponseEntity<>((List<Line>) ls.getAllLines(), HttpStatus.OK);

    }

    @GetMapping("/{id}")
    public Line getLineById(@PathVariable("id") Integer id) {
        Optional<Line> l = ls.getLineById(id);
        if (!l.isPresent())
            throw new ResourceNotFoundException("Line", "id", id);
        return l.get();
    }

    @PostMapping()
    public ResponseEntity<Line> createLine(@Valid @RequestBody Line l) {
        l = ls.save(l);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(l.getId())
                .toUri();
        return ResponseEntity.created(location).body(l);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateLine(@Valid @RequestBody Line l, @PathVariable("id") Integer id) {
        Line lToUpdate = getLineById(id);
        BeanUtils.copyProperties(l, lToUpdate, "id");
        ls.save(lToUpdate);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLine(@PathVariable("id") Integer id) {
        if (getLineById(id) != null)
            ls.delete(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping()
    public ResponseEntity<Void> deleteLinesByGameId(
            @ParameterObject @RequestParam(value = "gameid", required = true) Integer gameid) {
        ls.deleteByGameId(gameid);
        return ResponseEntity.noContent().build();
    }
}
