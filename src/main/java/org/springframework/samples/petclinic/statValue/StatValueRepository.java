package org.springframework.samples.petclinic.statValue;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StatValueRepository extends CrudRepository<StatValue,Integer> {

    List<StatValue> findAll();
    Optional<StatValue> findById(Integer id);
    List<StatValue> findByValue(Integer value);
    
}