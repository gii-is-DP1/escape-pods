package org.springframework.samples.petclinic.statistics;

import org.springframework.samples.petclinic.model.BaseEntity;
import org.springframework.samples.petclinic.startValue.StartValue;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotNull;

@Entity
public class Statistics extends BaseEntity {
    @NotNull
    String name;
    
    @OneToMany
    @NotNull    
    StartValue startValue;
    /* 
    no esta definida en el uml la relacin, ademas de que no esta creada la clase gamestats
    GameStats gameStats;
*/
    
}
