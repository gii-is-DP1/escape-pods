package org.springframework.samples.petclinic.shelterCard;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShelterCardRepository extends CrudRepository<ShelterCard,Integer> {

    List<ShelterCard> findAll();
    Optional<ShelterCard> findById(Integer id);
    List<ShelterCard> findByType(Type type);
    
    @Query("SELECT sc FROM ShelterCard sc WHERE sc.game.id=:id")
    List<ShelterCard> findByGameId(Integer id);

    Integer countById(Integer id);
}
