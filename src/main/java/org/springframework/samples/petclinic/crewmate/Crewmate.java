package org.springframework.samples.petclinic.crewmate;

import org.springframework.samples.petclinic.model.BaseEntity;
import  org.springframework.samples.petclinic.player.Color;

import jakarta.persistence.Entity;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@EqualsAndHashCode(of="id")
public class Crewmate extends BaseEntity{
    Color color;
    Role role;
    
}
