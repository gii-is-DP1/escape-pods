package org.springframework.samples.petclinic.beacon;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

@Service
public class BeaconService {

    BeaconRepository br;

    @Autowired
    public BeaconService(BeaconRepository br){
        this.br=br;
    }

    @Transactional(readOnly=true)
    public List<Beacon> getAllBeacons(){
        return br.findAll();
    }

    @Transactional(readOnly=true)
    public Optional<Beacon> getBeaconById(Integer id) {        
        return br.findById(id);
    }
    
    @Transactional(readOnly=true)
    public List<Beacon> getBeaconByColors(String color1, String color2){
        return br.findByColors(color1, color2);
    }

    @Transactional
    public Beacon save(Beacon b) {
        br.save(b);
        return b;
    }
    @Transactional()
    public void delete(Integer id) {
        br.deleteById(id);
    }

}
