package org.springframework.escapePods.specialActionCard;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// TODO preguntar porque no podriamos hacer uso directamente del repositorio y debemos recurrir a service

@Service
public class SpecialActionCardService {

    SpecialActionCardRepository spr;

    @Autowired
    public SpecialActionCardService(SpecialActionCardRepository spr){
        this.spr=spr;
    }
    //creamos este metodo en el servicio a partir de los metood integrdos en el repositorio
    @Transactional(readOnly=true)
    public SpecialActionCard getCardbyPlayerId(Integer id){
        //TODO OPERACION PENDIENTE DE DOTAR DE FUNCIONALIDAD
        return spr.findByPlayerId(id);
    }
    //los diferentes metodos relacionados a crud que extraemos del repositorio
    public SpecialActionCard save(SpecialActionCard sp){
        spr.save(sp);
        return sp;
    }

    @Transactional()
    public void delete(Integer id) {
        spr.deleteById(id);
    }
    public Optional<SpecialActionCard> getspecialActionCardbyId(Integer id) {
        return spr.findById(id);
    }
    
}
