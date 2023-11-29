package org.springframework.samples.petclinic.shelterCard;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ShelterCardService {

    ShelterCardRepository sc;
    
    @Autowired
    public ShelterCardService(ShelterCardRepository sc){
        this.sc=sc;
    }

    @Transactional(readOnly=true)
    public List<ShelterCard> getAllShelterCards(){
        return sc.findAll();
    }
    
    @Transactional(readOnly=true)
    public Optional<ShelterCard> getShelterCardById(Integer id){
        return sc.findById(id);
    }

    @Transactional
    public ShelterCard save(ShelterCard g) {
        sc.save(g);
        return g;
    }

    @Transactional(readOnly=true)
    public List<ShelterCard> getShelterCardByType(Type type){
        return sc.findByType(type);
    }

     @Transactional(readOnly=true)
    public List<ShelterCard> getShelterCardByGameId(Integer id){
        return sc.findByGameId(id);
    }

    @Transactional()
    public void delete(Integer id) {
        sc.deleteById(id);
    }  
}
