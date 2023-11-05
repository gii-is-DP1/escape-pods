package org.springframework.samples.petclinic.explosionCard;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class ExplosionCardService {

    ExplosionCardRepository ecr;

    @Autowired
    public  ExplosionCardService(ExplosionCardRepository ecr){
        this.ecr=ecr;
    }

    @Transactional(readOnly=true)
    public List<ExplosionCard> getExplosionCards(){
        return ecr.findAll();
        
    }
    @Transactional(readOnly=true)
    public ExplosionCard getExplosionCardById(Integer id){
        return ecr.findExplosionCardById(id);
    }
    //creacion de lo metodos de guardado y borrado
    
     @Transactional
    public ExplosionCard save(ExplosionCard ec) {
        ecr.save(ec);
        return ec;
    }

     @Transactional()
    public void delete(Integer id) {
        ecr.deleteById(id);
    }

    
}
