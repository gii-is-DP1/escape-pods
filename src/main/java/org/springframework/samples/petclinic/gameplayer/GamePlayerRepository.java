package org.springframework.samples.petclinic.gameplayer;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GamePlayerRepository extends CrudRepository<GamePlayer,Integer>{


    List<GamePlayer> findByColor(String pattern);
    List<GamePlayer> findAll();
    

}
