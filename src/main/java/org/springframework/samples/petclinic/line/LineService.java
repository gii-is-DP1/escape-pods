package org.springframework.samples.petclinic.line;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

//por ahora solo se estan sacando la lista de juegos que encajen con los fitros usados, se debe añadir las "reglas del juego aqui"
@Service
public class LineService {
    
    LineRepository lr;

    @Autowired
    public LineService(LineRepository lr){
        this.lr=lr;
    }

    @Transactional(readOnly=true)
    public List<Line> getAllLines(){
        return lr.findAll();
    }
    

    @Transactional(readOnly=true)
    public Optional<Line> getLineById(Integer id) {        
        return lr.findById(id);
    }
    @Transactional
    public Line save(Line l) {
        lr.save(l);
        return l;
    }


    @Transactional()
    public void delete(Integer id) {
        lr.deleteById(id);
    }
}