package org.springframework.samples.petclinic.pods;

import org.springframework.samples.petclinic.game.Game;
import org.springframework.samples.petclinic.model.BaseEntity;
import org.springframework.samples.petclinic.sector.Sector;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

@Entity
public class Pod extends BaseEntity{
    @NotNull
    @Max(3)
    @Min(0)
    Integer emptySlots;

    @NotNull
    @Max(3)
    @Min(1)
    Integer capacity;

    @OneToOne
    @NotNull
    Sector sector;

    @ManyToOne
    @NotNull
    Game game;
    
    
}
