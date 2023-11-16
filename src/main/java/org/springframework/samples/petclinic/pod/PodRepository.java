package org.springframework.samples.petclinic.pod;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PodRepository extends CrudRepository<Pod,Integer>{
    List<Pod> findAll();
    List<Pod> findByCapacity(Integer capacity);
    List<Pod> findByEmptySlots(Integer emptySlots);
    Optional<Pod> findById(Integer id);
    
}
