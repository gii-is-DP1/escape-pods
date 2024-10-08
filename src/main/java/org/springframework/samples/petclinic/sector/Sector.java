package org.springframework.samples.petclinic.sector;

import java.util.List;

import org.springframework.samples.petclinic.game.Game;
import org.springframework.samples.petclinic.line.Line;
import org.springframework.samples.petclinic.model.BaseEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Sector extends BaseEntity{

    @NotNull
    Integer number;

    @NotNull
    Boolean scrap;

    @NotNull
    @ManyToMany(cascade = {CascadeType.REMOVE})
    List<Line> lines;

    @ManyToOne
    @NotNull
    Game game;
    
}
