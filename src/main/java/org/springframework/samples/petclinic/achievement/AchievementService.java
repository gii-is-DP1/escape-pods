package org.springframework.samples.petclinic.achievement;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AchievementService {

    AchievementRepository a;
    
    @Autowired
    public AchievementService(AchievementRepository a){
        this.a=a;
    }

    @Transactional(readOnly=true)
    public List<Achievement> getAllAchievements(){
        return a.findAll();
    }
    
    @Transactional(readOnly=true)
    public Optional<Achievement> getAchievementById(Integer id){
        return a.findById(id);
    }

    @Transactional
    public Achievement save(Achievement g) {
        a.save(g);
        return g;
    }

    @Transactional(readOnly=true)
    public List<Achievement> getAchievementByType(AchievementType type){
        return a.findByType(type);
    }

    @Transactional(readOnly=true)
    public List<Achievement> getAchievementByName(String name){
        return a.findByName(name);
    }

    @Transactional()
    public void delete(Integer id) {
        a.deleteById(id);
    }  
}
