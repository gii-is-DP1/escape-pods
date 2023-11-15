package org.springframework.samples.petclinic.statistics;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StatisticsRepository extends CrudRepository<Statistics,Integer> {

    List<Statistics> findAll();
    Statistics findById();
    List<Statistics> findByName(String name);
    
}
