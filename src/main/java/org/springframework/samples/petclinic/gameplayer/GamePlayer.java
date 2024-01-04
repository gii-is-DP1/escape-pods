package org.springframework.samples.petclinic.gameplayer;

import org.springframework.samples.petclinic.game.Game;
import org.springframework.samples.petclinic.model.BaseEntity;
import org.springframework.samples.petclinic.player.Player;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
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
    Integer actions;

    @NotNull
    Integer points;

    @NotNull
    Color color;

    @NotNull
    @OneToOne
    Player player;

    @ManyToOne
    @NotNull
    Game game;

}
