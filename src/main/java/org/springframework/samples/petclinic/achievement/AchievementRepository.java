package org.springframework.samples.petclinic.achievement;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AchievementRepository extends CrudRepository<Achievement,Integer>{
    List<Achievement> findAll();
    Optional<Achievement> findById(Integer Id);
    List<Achievement> findByType(AchievementType type);
    List<Achievement> findByName(String name);
    
}
