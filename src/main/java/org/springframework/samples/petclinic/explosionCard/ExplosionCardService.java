package org.springframework.samples.petclinic.explosionCard;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ExplosionCardService {

    ExplosionCardRepository ec;

    @Autowired
    public ExplosionCardService(ExplosionCardRepository ec){
        this.ec=ec;
    }

    @Transactional(readOnly=true)
    public List<ExplosionCard> getAllExplosionCards(){
        return ec.findAll();
    }

    @Transactional(readOnly=true)
    public Optional<ExplosionCard> getExplosionCardById(Integer id){
        return ec.findById(id);
    }

    @Transactional
    public ExplosionCard save(ExplosionCard g) {
        ec.save(g);
        return g;
    }

    @Transactional(readOnly=true)
    public List<ExplosionCard> getExplosionCardByNumber(Integer number){
        return ec.findByNumber(number);
    }

    @Transactional(readOnly=true)
    public List<ExplosionCard> getExplosionCardByGameId(Integer id){
        return ec.findByGameId(id);
    }
    
    @Transactional()
    public void delete(Integer id) {
        ec.deleteById(id);
    }
}
