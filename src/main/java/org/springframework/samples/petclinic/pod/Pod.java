package org.springframework.samples.petclinic.pod;

import org.springframework.samples.petclinic.game.Game;
import org.springframework.samples.petclinic.model.BaseEntity;
import org.springframework.samples.petclinic.sector.Sector;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Pod extends BaseEntity {
    @NotNull
    @Max(3)
    @Min(0)
    Integer emptySlots;

    @NotNull
    @Max(3)
    @Min(1)
    Integer capacity;

    @NotNull
    @Min(1)
    @Max(6)
    Integer number;
    /*
     * representa al pod dentro de cada partida: 1 para pod de capacidad 3, 2 y 3
     * para capacidad 2,
     * resto para capacidad 1
     */

    @OneToOne
    Sector sector;

    @ManyToOne
    @NotNull
    Game game;

}
