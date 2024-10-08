package org.springframework.samples.petclinic.sector;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SectorRepository extends CrudRepository<Sector, Integer> {

    List<Sector> findAll();

    Optional<Sector> findById(Integer id);

    List<Sector> findByScrap(Boolean scrap);

    @Query("SELECT s FROM Sector s WHERE s.game.id= :id")
    List<Sector> findByGameId(Integer id);

    @Modifying
    @Query("DELETE FROM Sector s WHERE s.game.id=:id")
    int deleteByGameId(@Param("id") Integer id);

}
