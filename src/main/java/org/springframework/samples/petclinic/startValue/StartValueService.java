package org.springframework.samples.petclinic.startValue;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StartValueService {

    StartValueRepository sv;
    
    @Autowired
    public StartValueService(StartValueRepository sv){
        this.sv=sv;
    }

    @Transactional(readOnly=true)
    public List<StartValue> getAllStartValues(){
        return sv.findAll();
    }
    
    @Transactional(readOnly=true)
    public Optional<StartValue> getStartValueById(Integer id){
        return sv.findById(id);
    }

    @Transactional
    public StartValue save(StartValue Sv) {
        sv.save(Sv);
        return Sv;
    }

    @Transactional(readOnly=true)
    public List<StartValue> getStartValueByValue(Integer value){
        return sv.findByValue(value);
    }

    @Transactional()
    public void delete(Integer id) {
        sv.deleteById(id);
    }    
}
