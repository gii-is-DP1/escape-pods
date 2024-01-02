package org.springframework.samples.petclinic.explosionCard;

import org.springframework.samples.petclinic.model.BaseEntity;

import jakarta.persistence.Entity;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class ExplosionCard extends BaseEntity{

    @NotNull
    @Min(4)
    @Max(10)
    Integer number;

}
