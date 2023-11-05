package org.springframework.samples.petclinic.actionCard;

import org.springframework.data.repository.CrudRepository;

public interface ActionCardRepository extends CrudRepository<ActionCard,Integer> {

    ActionCard findByPlayerId(Integer id);
    
}
