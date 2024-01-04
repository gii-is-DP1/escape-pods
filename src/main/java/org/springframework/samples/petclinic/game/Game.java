package org.springframework.samples.petclinic.game;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.samples.petclinic.model.BaseEntity;
import org.springframework.samples.petclinic.player.Player;
import org.springframework.samples.petclinic.shelterCard.ShelterCard;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
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
@EqualsAndHashCode(of = "id")
@Table(name = "games")
public class Game extends BaseEntity {

    @Column(name = "num_players")
    @NotNull
    @Max(5)
    @Min(2)
    Integer numPlayers;

    @CreationTimestamp
    LocalDateTime start;

    LocalDateTime finish;

    @NotNull
    @Enumerated(EnumType.STRING)
    GameStatus status;

    @NotNull
    @ManyToMany(cascade = CascadeType.MERGE)
    List<Player> players;

    // @OneToMany
    // @NotNull
    // private List<ExplosionCard> explosionCards;

    @ElementCollection
    private List<Integer> explosions;

    public Game() {
        explosions = new ArrayList<>(Arrays.asList(4, 5, 6, 7, 8, 9, 10));
        Collections.shuffle(explosions);
    }

}