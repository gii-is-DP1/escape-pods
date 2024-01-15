package org.springframework.samples.petclinic.beacon;

import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BeaconRepository extends CrudRepository<Beacon, Integer> {
    List<Beacon> findAll();

    List<Beacon> findByColor1(String color1);

    @Query("SELECT b FROM Beacon b WHERE b.game.id= :id")
    List<Beacon> findByGameId(Integer id);

    @Modifying
    @Query("DELETE FROM Beacon b WHERE b.game.id=:id")
    int deleteByGameId(@Param("id") Integer id);
}
