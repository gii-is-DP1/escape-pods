package org.springframework.samples.petclinic.gameplayer;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import org.springframework.stereotype.Repository;

@Repository
public interface GamePlayerRepository extends CrudRepository<GamePlayer, Integer> {

    List<GamePlayer> findByColor(String pattern);

    List<GamePlayer> findAll();

    Optional<GamePlayer> findByPlayerId(Integer playerId);

    @Query("SELECT g FROM GamePlayer g WHERE g.game.id = :gameId")
    List<GamePlayer> findByGameId(Integer gameId);
}
