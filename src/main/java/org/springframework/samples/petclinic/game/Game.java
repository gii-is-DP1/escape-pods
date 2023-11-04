package org.springframework.samples.petclinic.game;


import java.time.LocalDateTime;

import org.springframework.samples.petclinic.model.NamedEntity;

import jakarta.persistence.Entity;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@EqualsAndHashCode(of="id")
public class Game extends NamedEntity{
    //establecemos los datos que una partida tendrá
    String code;
    LocalDateTime start;
    LocalDateTime finish;
    Integer players;
    GameStatus status;


    
}
