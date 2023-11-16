package org.springframework.samples.petclinic.statValue;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StatValueRepository extends CrudRepository<StatValue,Integer> {

    List<StatValue> findAll();
    StatValue findById();
    List<StatValue> findByValue(Integer value);
    
}