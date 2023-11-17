package org.springframework.samples.petclinic.shelterCard;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShelterCardRepository extends CrudRepository<ShelterCard,Integer> {

    List<ShelterCard> findAll();
    Optional<ShelterCard> findById(Integer id);
    List<ShelterCard> findByType(Type type);
    
}
