package org.springframework.samples.petclinic.startValue;

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
@RequestMapping("/api/v1/StartValue")
@Tag(name = "StartValues", description = "API for the  management of StartValues.")
@SecurityRequirement(name = "bearerAuth")
public class StartValueController {
    StartValueService sts;

    @Autowired
    public StartValueController(StartValueService sts){
        this.sts=sts;
    }

    @GetMapping
    public List<StartValue> getAllStartValues(@ParameterObject @RequestParam(value="status",required = false) Integer value){
        if(value!=null){
            return sts.getStartValueByValue(value);
        }else 
            return sts.getAllStartValues();
    }

    @GetMapping("/{id}")
    public StartValue getStartValueById(@PathVariable("id")Integer id){
        Optional<StartValue> g=sts.getStartValueById(id);
        if(!g.isPresent())
            throw new ResourceNotFoundException("StartValue", "id", id);
        return g.get();
    }

    @PostMapping()
    public ResponseEntity<StartValue> createStartValue(@Valid @RequestBody StartValue g){
        g=sts.save(g);
        URI location = ServletUriComponentsBuilder
                    .fromCurrentRequest()
                    .path("/{id}")
                    .buildAndExpand(g.getId())
                    .toUri();
        return ResponseEntity.created(location).body(g);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateStartValue(@Valid @RequestBody StartValue g,@PathVariable("id")Integer id){
        StartValue gToUpdate=getStartValueById(id);
        BeanUtils.copyProperties(g,gToUpdate, "id");
        sts.save(gToUpdate);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStartValue(@PathVariable("id")Integer id){
        if(getStartValueById(id)!=null)
            sts.delete(id);
        return ResponseEntity.noContent().build();
    }
      
    
}
