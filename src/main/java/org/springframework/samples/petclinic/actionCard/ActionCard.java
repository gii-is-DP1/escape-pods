package org.springframework.samples.petclinic.actionCard;

import org.springframework.samples.petclinic.model.NamedEntity;

import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotNull;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@EqualsAndHashCode(of="id")
public class ActionCard extends NamedEntity {
    
    @NotNull
    Integer up;

    @NotNull
    Integer down;

    @NotNull
    Boolean spy;

    @NotNull
    Boolean acelerate;

    @NotNull
    Boolean minipod;
}
