package org.springframework.samples.petclinic.shelterCard;


import org.springframework.samples.petclinic.game.Game;
import org.springframework.samples.petclinic.model.BaseEntity;
import org.springframework.samples.petclinic.sector.Sector;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class ShelterCard extends BaseEntity{

    @NotNull
    Integer explosion;

    @NotNull
    Type type;

    @ManyToOne
    @NotNull
    Game game;

    @NotNull
    @ManyToOne
    Sector sector;
     
}
