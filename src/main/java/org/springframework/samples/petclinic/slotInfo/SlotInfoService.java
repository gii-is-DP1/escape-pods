package org.springframework.samples.petclinic.slotInfo;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SlotInfoService {

    SlotInfoRepository si;
    
    @Autowired
    public SlotInfoService(SlotInfoRepository si){
        this.si=si;
    }

    @Transactional(readOnly=true)
    public List<SlotInfo> getAllSlotInfos(){
        return si.findAll();
    }
    
    @Transactional(readOnly=true)
    public Optional<SlotInfo> getSlotInfoById(Integer id){
        return si.findById(id);
    }

    @Transactional
    public SlotInfo save(SlotInfo g) {
        si.save(g);
        return g;
    }

    @Transactional(readOnly=true)
    public List<SlotInfo> getSlotInfoByPosition(Integer postion){
        return si.findByPosition(postion);
    }

    @Transactional()
    public void delete(Integer id) {
        si.deleteById(id);
    }
}
