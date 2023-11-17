package org.springframework.samples.petclinic.sector;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SectorService {

    SectorRepository s;
    
    @Autowired
    public SectorService(SectorRepository s){
        this.s=s;
    }

    @Transactional(readOnly=true)
    public List<Sector> getAllSectors(){
        return s.findAll();
    }
    
    @Transactional(readOnly=true)
    public Optional<Sector> getSectorById(Integer id){
        return s.findById(id);
    }

    @Transactional
    public Sector save(Sector sec) {
        s.save(sec);
        return sec;
    }

    @Transactional(readOnly=true)
    public List<Sector> getSectorScrapped(Boolean scrap){
        return s.findByScrap(scrap);
    }

    @Transactional()
    public void delete(Integer id) {
        s.deleteById(id);
    }
}
