package org.springframework.samples.petclinic.crewmate;

import org.hibernate.annotations.ManyToAny;
import org.springframework.samples.petclinic.model.BaseEntity;
import  org.springframework.samples.petclinic.player.Color;
import org.springframework.samples.petclinic.player.Player;
import org.springframework.samples.petclinic.pods.Pod;
import org.springframework.samples.petclinic.shelterCard.ShelterCard;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotNull;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@EqualsAndHashCode(of="id")
public class Crewmate extends BaseEntity{
    @NotNull
    Color color;

    @NotNull
    Role role;

    @ManyToOne
    @NotNull
    Player player;

    @ManyToOne(optional = true)
    ShelterCard shelterCard;

    @ManyToOne(optional = true)
    Pod pod;
    
}
