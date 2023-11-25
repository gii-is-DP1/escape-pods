package org.springframework.samples.petclinic.line;

import org.springframework.samples.petclinic.beacon.Beacon;
import org.springframework.samples.petclinic.game.Game;
import org.springframework.samples.petclinic.model.BaseEntity;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Line extends BaseEntity{

    @NotNull
    Integer number;
    
    @OneToOne(optional = true)
    Beacon beacon;

    @ManyToOne
    @NotNull
    Game game;

    
}
