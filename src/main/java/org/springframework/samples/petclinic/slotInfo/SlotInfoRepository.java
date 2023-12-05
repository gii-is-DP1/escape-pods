package org.springframework.samples.petclinic.slotInfo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SlotInfoRepository extends CrudRepository<SlotInfo,Integer>{
    
    List<SlotInfo> findAll();
    List<SlotInfo> findByPosition(Integer position);
    Optional<SlotInfo> findById(Integer id);
    @Query("SELECT si FROM SlotInfo si WHERE si.game.id= :id")
    List<SlotInfo> findByGameId(Integer id);

}
