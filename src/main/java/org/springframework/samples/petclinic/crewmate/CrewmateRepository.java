package org.springframework.samples.petclinic.crewmate;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CrewmateRepository extends CrudRepository<Crewmate,Integer>{
    // AQUI NO SE REALMENTE QUE HAY QUE PONER

    List<Crewmate> findCrewmate();

}
