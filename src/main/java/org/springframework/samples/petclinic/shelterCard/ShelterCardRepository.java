package org.springframework.samples.petclinic.shelterCard;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShelterCardRepository extends CrudRepository<ShelterCard,Integer> {

    List<ShelterCard> findAll();
    ShelterCard findById();
    List<ShelterCard> findByType(Type type);
    
}
