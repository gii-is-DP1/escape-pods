package org.springframework.samples.petclinic.explosionCard;


import org.springframework.samples.petclinic.model.NamedEntity;

import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotBlank;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@EqualsAndHashCode(of="id")
public class ExplosionCard extends NamedEntity {

    @NotBlank
    Integer Coordinates;
}
