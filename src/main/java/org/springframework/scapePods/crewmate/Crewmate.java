package org.springframework.scapePods.crewmate;

import org.springframework.samples.petclinic.model.BaseEntity;
import org.springframework.scapePods.enums.Color;
import org.springframework.scapePods.enums.Role;

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
