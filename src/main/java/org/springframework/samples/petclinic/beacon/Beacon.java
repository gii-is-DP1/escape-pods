package org.springframework.samples.petclinic.beacon;
import org.springframework.samples.petclinic.game.Game;
import org.springframework.samples.petclinic.gameplayer.Color;
import org.springframework.samples.petclinic.model.BaseEntity;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Beacon extends BaseEntity {

    @NotNull
    Color color1;

    @NotNull
    Color color2;

    @ManyToOne
    @NotNull
    Game game;


}
