package org.springframework.samples.petclinic.crewmate;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CrewmateRepository extends CrudRepository<Crewmate, Integer> {

    List<Crewmate> findAll();

    Optional<Crewmate> findById(Integer id);

    @Query("SELECT c FROM Crewmate c WHERE c.game.id= :id")
    List<Crewmate> findByGameId(Integer id);

    @Modifying
    @Query("DELETE FROM Crewmate c WHERE c.game.id=:id")
    void deleteByGameId(@Param("id") Integer id);

}
