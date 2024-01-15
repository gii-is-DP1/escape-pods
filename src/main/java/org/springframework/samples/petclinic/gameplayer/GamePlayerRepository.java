package org.springframework.samples.petclinic.gameplayer;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GamePlayerRepository extends CrudRepository<GamePlayer, Integer> {

    List<GamePlayer> findAll();

    Optional<GamePlayer> findById(Integer id);

    @Query("SELECT g FROM GamePlayer g WHERE g.game.id = :gameId")
    List<GamePlayer> findByGameId(Integer gameId);

    @Modifying
    @Query("DELETE FROM GamePlayer g WHERE g.game.id=:id")
    int deleteByGameId(@Param("id") Integer id);

    @Query("SELECT g FROM GamePlayer g WHERE g.player.id = :playerId")
    GamePlayer findByPlayerId(Integer playerId);
}
