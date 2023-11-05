package org.springframework.escapePods.player;


import org.springframework.samples.petclinic.model.BaseEntity;
import org.springframework.escapePods.enums.Color;

import jakarta.persistence.Entity;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@EqualsAndHashCode(of="id")
public class Player extends BaseEntity {
    //establecemos los datos que una player tendrá
    Integer actions;
    Integer points;
    Color color;

}
