package org.springframework.samples.petclinic.pod;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class PodService {

    PodRepository p;
    
    @Autowired
    public PodService(PodRepository p){
        this.p=p;
    }

    @Transactional(readOnly=true)
    public List<Pod> getAllPodss(){
        return p.findAll();
    }
    
    @Transactional(readOnly=true)
    public Optional<Pod> getPodsById(Integer id){
        return p.findById(id);
    }

    @Transactional
    public Pod save(Pod pod) {
        p.save(pod);
        return pod;
    }

    @Transactional(readOnly=true)
    public List<Pod> getPodsByCapacity(Integer capacity){
        return p.findByCapacity(capacity);
    }

    
    @Transactional(readOnly=true)
    public List<Pod> getPodsByEmptySlots(Integer emptySlots){
        return p.findByEmptySlots(emptySlots);
    }


    @Transactional()
    public void delete(Integer id) {
        p.deleteById(id);
    }
}

