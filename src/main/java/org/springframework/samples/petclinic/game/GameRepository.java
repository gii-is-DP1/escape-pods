package org.springframework.samples.petclinic.game;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GameRepository extends CrudRepository<Game,Integer> {
    List<Game> findAll();

    List<Game> findByStart(LocalDateTime start);
    List<Game> findByFinish(LocalDateTime finish);
    List<Game> findByStatus(GameStatus status);
    List<Game> findByFinishIsNotNull();

    List<Game> findByFinishIsNullAndStartIsNotNull();
}