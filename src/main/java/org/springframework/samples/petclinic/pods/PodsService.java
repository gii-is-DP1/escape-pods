package org.springframework.samples.petclinic.pods;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class PodsService {

    PodsRepository p;
    
    @Autowired
    public PodsService(PodsRepository p){
        this.p=p;
    }

    @Transactional(readOnly=true)
    public List<Pods> getAllPodss(){
        return p.findAll();
    }
    
    @Transactional(readOnly=true)
    public Optional<Pods> getPodsById(Integer id){
        return p.findById(id);
    }

    @Transactional
    public Pods save(Pods pod) {
        p.save(pod);
        return pod;
    }

    @Transactional(readOnly=true)
    public List<Pods> getPodsByCapacity(Integer capacity){
        return p.findByCapacity(capacity);
    }

    
    @Transactional(readOnly=true)
    public List<Pods> getPodsByEmptySlots(Integer emptySlots){
        return p.findByEmptySlots(emptySlots);
    }


    @Transactional()
    public void delete(Integer id) {
        p.deleteById(id);
    }
}

