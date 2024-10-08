package org.springframework.samples.petclinic.gameplayer;

import org.springframework.samples.petclinic.game.Game;
import org.springframework.samples.petclinic.model.BaseEntity;
import org.springframework.samples.petclinic.player.Player;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@EqualsAndHashCode(of = "id")
public class GamePlayer extends BaseEntity {
    @NotNull
    @Min(1)
    @Max(2)
    Integer actions;

    @NotNull
    Color color;

    @NotNull
    @OneToOne
    Player player;

    @ManyToOne
    @NotNull
    Game game;

    @NotNull
    Boolean noMoreTurns;

}
