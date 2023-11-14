package org.springframework.samples.petclinic.pods;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PodsRepository extends CrudRepository<Pods,Integer>{
    List<Pods> findAll();
    List<Pods> findByCapacity(Integer capacity);
    List<Pods> findByEmptySlots(Integer emptySlots);
    Optional<Pods> findById(Integer id);
    
}
