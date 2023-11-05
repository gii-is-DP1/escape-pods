package org.springframework.escapePods.specialActionCard;

import org.springframework.samples.petclinic.model.NamedEntity;

import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotNull;


import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
/*en principio no creamos tabla en la base de datos debido a que estas entidades son "temporales", solo son usadas durante la
partida y al acabar se almacenara informacion especifica de cada una */
@Entity
@Getter
@Setter

//nos permite indicar la regla de igualdad entre 2 entidades de tipo SpecialActionCard
@EqualsAndHashCode(of="id")
public class SpecialActionCard extends NamedEntity {

    @NotNull
    boolean boarding;
    
    @NotNull
    boolean drive;

    @NotNull
    boolean program;

    @NotNull
    boolean refresh;
    
}