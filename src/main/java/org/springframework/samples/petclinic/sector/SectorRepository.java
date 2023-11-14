package org.springframework.samples.petclinic.sector;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SectorRepository extends CrudRepository<Sector,Integer>{

    List<Sector> findAll();
    Optional<Sector> findById(Integer id);
    Sector findByName(String name);
    List<Sector> findByScrap(Boolean scrap);
    
}
