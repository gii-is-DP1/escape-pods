package org.springframework.samples.petclinic.startValue;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StartValueRepository extends CrudRepository<StartValue,Integer> {

    List<StartValue> findAll();
    StartValue findById();
    List<StartValue> findByValue(Integer value);
    
}