package org.springframework.escapePods.specialActionCard;

import java.net.URI;
import java.util.Optional;

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
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;


import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("api/v1/specialActionCard")
@Tag(name = "Special action cards", description = "API for the management of special action cards.")
@SecurityRequirement(name = "bearerAuth")

public class SpecialActionCardRestController {
 
    SpecialActionCardService specActServ;

    @Autowired 
    public SpecialActionCardRestController(SpecialActionCardService sas){
        this.specActServ=sas;

    }  
    //operacion de  lectura
    @GetMapping("/{id}")  
    public SpecialActionCard getspecialActionCardbyId(@PathVariable("id")Integer id){
        Optional<SpecialActionCard> sp=specActServ.getspecialActionCardbyId(id);
        if(!sp.isPresent())
            throw new ResourceNotFoundException("specialActionCard", "id", id);
        return sp.get();
    }
    
    @PostMapping() 
    public ResponseEntity<SpecialActionCard> createSpecialActionCard(@Valid @RequestBody SpecialActionCard sa){
        sa=specActServ.save(sa);
        //construimos la uri de la nueva carta de acciones a partir de los datos introducidos como parametros y la propia request
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(sa.getId())
                .toUri();
        return ResponseEntity.created(location).body(sa);
    }

    @PutMapping("/{id}")
             
    public ResponseEntity<Void> updateSpecialActionCard(@Valid @RequestBody SpecialActionCard sa, @PathVariable("id") Integer id){
        SpecialActionCard saToUpdate = getspecialActionCardbyId(id);
        BeanUtils.copyProperties(sa, saToUpdate, "id");
        //el save nos permite almacenar la nueva informacion en la misma carta(saToUpdate)
        specActServ.save(saToUpdate);
        return ResponseEntity.noContent().build();

    }
    //el {id} del ...Mapping nos indica que se usara la id de la url como informacion en la operacion a desarrollar(borrado en este caso)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGame(@PathVariable("id") Integer id){
        if(getspecialActionCardbyId(id)!=null){
            specActServ.delete(id);
        }
        return ResponseEntity.noContent().build();
    }
}
