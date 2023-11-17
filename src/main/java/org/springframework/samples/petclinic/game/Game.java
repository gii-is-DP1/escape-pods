package org.springframework.samples.petclinic.game;


import java.time.LocalDateTime;
import java.util.List;

import org.springframework.samples.petclinic.model.NamedEntity;
import org.springframework.samples.petclinic.shelterCard.ShelterCard;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@EqualsAndHashCode(of="id")
public class Game extends NamedEntity{

    @NotEmpty
    @Max(5)
    @Min(1)
    Integer numPlayers;
    
    LocalDateTime start;
    LocalDateTime finish;

    @NotNull
    GameStatus status;

    @OneToMany
    @NotNull
    List<ShelterCard> shelterCards;


    
}