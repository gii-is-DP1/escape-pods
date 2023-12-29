package org.springframework.samples.petclinic.game;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GameRepository extends CrudRepository<Game,Integer> {
    List<Game> findAll(Pageable pageable);

    List<Game> findByStart(LocalDateTime start);
    List<Game> findByFinish(LocalDateTime finish);
    List<Game> findByStatus(GameStatus status, Pageable pageable);
    List<Game> findByFinishIsNotNull(Pageable pageable);

    List<Game> findByFinishIsNullAndStartIsNotNull(Pageable pageable);
}