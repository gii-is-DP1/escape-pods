package org.springframework.scapePods.beacon;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BeaconRepository extends CrudRepository<Beacon,Integer>{
    List<Beacon> findAll();
    List<Beacon> findByColors(String color1, String color2);
}
