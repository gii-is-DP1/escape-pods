package org.springframework.samples.petclinic.explosionCard;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExplosionCardRepository extends CrudRepository<ExplosionCard,Integer>{
    
    List<ExplosionCard> findAll();
    ExplosionCard findExplosionCardById(Integer id);
}
