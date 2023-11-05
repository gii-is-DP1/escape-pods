package org.springframework.escapePods.player;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlayerRepository extends CrudRepository<Player,Integer>{


    List<Player> findByColor(String pattern);
    List<Player> findAll();
    List<Player> findByPink();
    List<Player> findByBlack();
    List<Player> findByWhite();
    List<Player> findByBlue();
    List<Player> findByYellow();

}
