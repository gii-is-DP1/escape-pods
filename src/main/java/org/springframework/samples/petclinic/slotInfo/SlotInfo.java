package org.springframework.samples.petclinic.slotInfo;



import org.springframework.samples.petclinic.crewmate.Role;
import org.springframework.samples.petclinic.game.Game;
import org.springframework.samples.petclinic.model.BaseEntity;
import org.springframework.samples.petclinic.shelterCard.ShelterCard;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class SlotInfo extends BaseEntity{ 

    @NotNull
    @Min(0)
    @Max(4)
    Integer position;

    @NotNull
    Role role;

    @NotNull
    @Min(2)
    @Max(5)
    Integer slotScore;
    
    @NotNull
    Boolean roleNeeded;

    
    @ManyToOne
    @NotNull
    ShelterCard shelter;

    @ManyToOne
    @NotNull
    Game game;
    
    
}
