package org.springframework.scapePods.game;


import java.time.LocalDateTime;

import org.springframework.samples.petclinic.model.NamedEntity;
import org.springframework.scapePods.enums.GameStatus;

import jakarta.persistence.Entity;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@EqualsAndHashCode(of="id")
public class Game extends NamedEntity{
    //establecemos los datos que una partida tendrá

    @NotNull
    @Digits(fraction = 0, integer = 6)
    String code;
    
    LocalDateTime start;
    LocalDateTime finish;

    @NotNull
    Integer players;

    @NotNull
    GameStatus status;

}
