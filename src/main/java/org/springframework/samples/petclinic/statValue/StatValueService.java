package org.springframework.samples.petclinic.statValue;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StatValueService {

    StatValueRepository sv;
    
    @Autowired
    public StatValueService(StatValueRepository sv){
        this.sv=sv;
    }

    @Transactional(readOnly=true)
    public List<StatValue> getAllStartValues(){
        return sv.findAll();
    }
    
    @Transactional(readOnly=true)
    public Optional<StatValue> getStartValueById(Integer id){
        return sv.findById(id);
    }

    @Transactional
    public StatValue save(StatValue Sv) {
        sv.save(Sv);
        return Sv;
    }

    @Transactional(readOnly=true)
    public List<StatValue> getStartValueByValue(Integer value){
        return sv.findByValue(value);
    }

    @Transactional()
    public void delete(Integer id) {
        sv.deleteById(id);
    }    
}
