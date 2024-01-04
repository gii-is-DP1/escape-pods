package org.springframework.samples.petclinic.explosionCard;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExplosionCardRepository extends CrudRepository<ExplosionCard,Integer>{

    List<ExplosionCard> findAll();
    List<ExplosionCard> findByNumber(Integer number);
    Optional<ExplosionCard> findById(Integer id);
    @Query("SELECT g.explosionCards FROM Game g WHERE g.id = :id")
    List<ExplosionCard> findByGameId(Integer id);
}
