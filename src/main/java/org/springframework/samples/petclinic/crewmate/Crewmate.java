package org.springframework.samples.petclinic.crewmate;

import org.hibernate.annotations.ManyToAny;
import org.springframework.samples.petclinic.game.Game;
import org.springframework.samples.petclinic.gameplayer.Color;
import org.springframework.samples.petclinic.gameplayer.GamePlayer;
import org.springframework.samples.petclinic.model.BaseEntity;
import org.springframework.samples.petclinic.pod.Pod;
import org.springframework.samples.petclinic.shelterCard.ShelterCard;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.criteria.CriteriaBuilder.In;
import jakarta.validation.constraints.NotNull;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@EqualsAndHashCode(of = "id")
public class Crewmate extends BaseEntity {
    @NotNull
    Color color;

    @NotNull
    Role role;

    Integer arrivalOrder;

    @ManyToOne
    @NotNull
    GamePlayer player;

    @ManyToOne(optional = true)
    ShelterCard shelterCard;

    @ManyToOne(optional = true)
    Pod pod;

    @ManyToOne
    @NotNull
    Game game;

}
