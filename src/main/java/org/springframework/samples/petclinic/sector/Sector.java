package org.springframework.samples.petclinic.sector;

import java.util.List;

import org.springframework.samples.petclinic.game.Game;
<<<<<<< HEAD
=======
import org.springframework.samples.petclinic.line.Line;
>>>>>>> main
import org.springframework.samples.petclinic.model.BaseEntity;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotNull;

@Entity
public class Sector extends BaseEntity{

    @NotNull
    String number;

    @NotNull
    Boolean scrap;

    @NotNull
    @ManyToMany
    List<Line> lines;

    @ManyToOne
    @NotNull
    Game game;
    
<<<<<<< HEAD
}
=======
}
>>>>>>> main
