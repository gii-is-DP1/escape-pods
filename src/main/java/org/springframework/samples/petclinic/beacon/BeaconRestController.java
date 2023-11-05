package org.springframework.samples.petclinic.beacon;

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
@RequestMapping("/api/v1/beacon")
@Tag(name = "Beacons", description = "API for the  management of  Beacons.")
@SecurityRequirement(name = "bearerAuth")
public class BeaconRestController {
    BeaconService bs;
    @Autowired
    public BeaconRestController(BeaconService bs){
        this.bs=bs;
    }
    @GetMapping
    public List<Beacon> getAllBeacons(@ParameterObject() @RequestParam(value="color1",required = false) String color1, 
    @ParameterObject @RequestParam(value="color2",required = false) String color2){
        if(color1!=null && color2==null)
            return bs.getBeaconByColors(color1, null);
        else if(color2!=null && color1==null){
            return bs.getBeaconByColors(null, color2);
        }else if(color1!=null && color2!=null){
            return bs.getBeaconByColors(color1, color2);
        }
        else
            return bs.getAllBeacons();
    }

    @GetMapping("/{id}")
    public Beacon getBeaconById(@PathVariable("id")Integer id){
        Optional<Beacon> b=bs.getBeaconById(id);
        if(!b.isPresent())
            throw new ResourceNotFoundException("Beacon", "id", id);
        return b.get();
    }

    @PostMapping()
    public ResponseEntity<Beacon> createBeacon(@Valid @RequestBody Beacon b){
        b=bs.save(b);
        URI location = ServletUriComponentsBuilder
                    .fromCurrentRequest()
                    .path("/{id}")
                    .buildAndExpand(b.getId())
                    .toUri();
        return ResponseEntity.created(location).body(b);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateBeacon(@Valid @RequestBody Beacon b,@PathVariable("id")Integer id){
        Beacon gToUpdate=getBeaconById(id);
        //el copy properties parece que necesita los datos a alterar, un nombre de la actualizacion y el id del juego que s eactualizra
        BeanUtils.copyProperties(b,gToUpdate, "id");
        bs.save(gToUpdate);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGame(@PathVariable("id")Integer id){
        if(getBeaconById(id)!=null)
            bs.delete(id);
        return ResponseEntity.noContent().build();
    }

}
