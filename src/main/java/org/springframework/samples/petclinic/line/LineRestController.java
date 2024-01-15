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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/lines")
@Tag(name = "Lines", description = "API for the  management of Lines, only authenticated users can access the methods below")
@SecurityRequirement(name = "bearerAuth")
public class LineRestController {
    LineService ls;

    @Autowired
    public LineRestController(LineService ls) {
        this.ls = ls;

    }

    @Operation(summary = "returns the list of lines that have been created", description = " you can give a gameId to filter the returned lines")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "200", description = "the given parameter was correct or the method can return all of the existent lines"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),
            @ApiResponse(responseCode = "404", description = " the gameId given is not associated to any existent game")

    })
    @GetMapping
    public ResponseEntity<List<Line>> getAllLines(
            @ParameterObject @RequestParam(value = "gameid", required = false) Integer gameid) {
        if (gameid != null) {
            return new ResponseEntity<>((List<Line>) ls.getAllLinesByGameId(gameid), HttpStatus.OK);
        } else
            return new ResponseEntity<>((List<Line>) ls.getAllLines(), HttpStatus.OK);

    }

    @Operation(summary = "returns the line that matches the given id")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "200", description = "the given parameter was correct"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),
            @ApiResponse(responseCode = "404", description = " the given id is not associated to any line")

    })
    @GetMapping("/{id}")
    public Line getLineById(@PathVariable("id") Integer id) {
        Optional<Line> l = ls.getLineById(id);
        if (!l.isPresent())
            throw new ResourceNotFoundException("Line", "id", id);
        return l.get();
    }

    @Operation(summary = "returns the created line", description = "the body of the request must be valid and match the restrictions and annotations defined")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "201", description = "the line has been created"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),
            @ApiResponse(responseCode = "400", description = "the request couldnt be done because the given line is not valid")

    })
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

    @Operation(summary = "this method updates the line ", description = "the given line must be valid")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "204", description = "the line has been updated"),
            @ApiResponse(responseCode = "400", description = "the request couldnt be done because the given line is not valid"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),
            @ApiResponse(responseCode = "404", description = "the given id is not associated to any line")
            

    })
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateLine(@Valid @RequestBody Line l, @PathVariable("id") Integer id) {
        Line lToUpdate = getLineById(id);
        BeanUtils.copyProperties(l, lToUpdate, "id");
        ls.save(lToUpdate);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "this method deletes the line that matches the id")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "204", description = "the given id was correct and the line was deleted"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),
            @ApiResponse(responseCode = "404", description = " the given id is not associated to any line")

    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLine(@PathVariable("id") Integer id) {
        if (getLineById(id) != null)
            ls.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "this method deletes all of the lines that matches the given game id ")
    @ApiResponses(value = {

            @ApiResponse(responseCode = "204", description = "the given id was correct and the lines associated to the game were deleted"),
            @ApiResponse(responseCode = "401", description = "the user must be fully authenticated to access this method"),
            @ApiResponse(responseCode = "404", description = " the given game id is not associated to any line")

    })
    @DeleteMapping()
    public ResponseEntity<Void> deleteLinesByGameId(
            @ParameterObject @RequestParam(value = "gameid", required = true) Integer gameid) {
                if(ls.getAllLinesByGameId(gameid).size()==0){
                    return ResponseEntity.notFound().build();
                }
        ls.deleteByGameId(gameid);
        return ResponseEntity.noContent().build();
    }
}
