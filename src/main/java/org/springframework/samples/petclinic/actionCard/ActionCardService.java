package org.springframework.samples.petclinic.actionCard;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ActionCardService {

    ActionCardRepository acr;

    @Autowired
    public ActionCardService(ActionCardRepository acr) {
        this.acr=acr;
    }

    @Transactional
    public ActionCard save(ActionCard ac) {
        acr.save(ac);
        return ac;
    }

    @Transactional(readOnly=true)
    public ActionCard getActionCardByPlayerId(Integer id) {        
        return acr.findByPlayerId(id);
    }

    @Transactional()
    public void delete(Integer id) {
        acr.deleteById(id);
    }
    
}
