package org.springframework.samples.petclinic.game;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GameRepository extends CrudRepository<Game,Integer> {
    //ya que estamos en spring podemos desarrollar funciones crud mediante un nombre que tenga los parametros especificos
    List<Game> findAll();

    List<Game> findByNameContains(String pattern);
    List<Game> findByStart(LocalDateTime start);
    List<Game> findByFinish(LocalDateTime finish);
    List<Game> findByCode(String code);

    List<Game> findByFinishIsNotNull();

    List<Game> findByFinishIsNullAndStartIsNotNull();
}
