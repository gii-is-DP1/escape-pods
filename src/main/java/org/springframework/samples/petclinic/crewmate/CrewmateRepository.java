package org.springframework.samples.petclinic.crewmate;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface CrewmateRepository extends CrudRepository<Crewmate,Integer>{
    // AQUI NO SE REALMENTE QUE HAY QUE PONER

    List<Crewmate> findAll();
    Optional<Crewmate> findById(Integer id);
    @Query("SELECT c FROM Crewmate c WHERE c.game.id= :id")
    List<Crewmate> findByGameId(Integer id);

}
