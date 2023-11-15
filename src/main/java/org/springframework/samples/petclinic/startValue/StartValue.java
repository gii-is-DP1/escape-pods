package org.springframework.samples.petclinic.startValue;

import org.h2.engine.User;
import org.springframework.samples.petclinic.model.BaseEntity;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotNull;

@Entity
public class StartValue extends BaseEntity{
    @NotNull
    Double value;
    
    @ManyToOne
    @NotNull
    User user;
}
