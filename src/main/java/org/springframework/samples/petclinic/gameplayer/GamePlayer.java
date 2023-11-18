package org.springframework.samples.petclinic.gameplayer;


import org.h2.engine.User;
import org.springframework.samples.petclinic.game.Game;
import org.springframework.samples.petclinic.model.BaseEntity;
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
@EqualsAndHashCode(of="id")
public class GamePlayer extends BaseEntity {
    @NotNull
    Integer actions;

    @NotNull
    Integer points;

    @NotNull
    Color color;

//    @NotNull
//    @OneToOne
//    User user;
    
    @ManyToOne
    @NotNull
    Game game;


}
