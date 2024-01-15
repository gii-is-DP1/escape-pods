package org.springframework.samples.petclinic.line;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface LineRepository extends CrudRepository<Line, Integer> {
    List<Line> findAll();

    Optional<Line> findById(Integer id);

    @Query("SELECT l FROM Line l WHERE l.game.id = :id")
    List<Line> findByGameId(Integer id);

    @Modifying
    @Query("DELETE FROM Line l WHERE l.game.id= :id")
    int deleteByGameId(@Param("id") Integer id);
}
