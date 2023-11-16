package org.springframework.samples.petclinic.statistics;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StatisticsService {

    StatisticsRepository s;
    
    @Autowired
    public StatisticsService(StatisticsRepository s){
        this.s=s;
    }

    @Transactional(readOnly=true)
    public List<Statistics> getAllStatisticss(){
        return s.findAll();
    }
    
    @Transactional(readOnly=true)
    public Optional<Statistics> getStatisticsById(Integer id){
        return s.findById(id);
    }

    @Transactional
    public Statistics save(Statistics g) {
        s.save(g);
        return g;
    }

    @Transactional(readOnly=true)
    public List<Statistics> getStatisticsByName(String name){
        return s.findByName(name);
    }

    @Transactional()
    public void delete(Integer id) {
        s.deleteById(id);
    }  
}
