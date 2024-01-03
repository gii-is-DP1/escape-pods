package org.springframework.samples.petclinic.game;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Pageable;

@Service
public class GameService {
    
    GameRepository gr;

    @Autowired
    public GameService(GameRepository gr){
        this.gr=gr;
    }

    @Transactional(readOnly=true)
    public List<Game> getAllGames(Pageable pageable){
        return gr.findAll(pageable);
    }
   
    @Transactional(readOnly=true)
    public List<Game> getWaitingGames(Pageable pageable){
        return gr.findByStatus(GameStatus.WAITING, pageable);
    }

    @Transactional
    public Game save(Game g) {
        gr.save(g);
        return g;
    }
    @Transactional(readOnly=true)
    public Optional<Game> getGameById(Integer id) {        
        return gr.findById(id);
    }

    @Transactional()
    public void delete(Integer id) {
        gr.deleteById(id);
    }
    @Transactional(readOnly=true)
    public List<Game> getFinishedGames(Pageable pageable) {
        return gr.findByFinishIsNotNull(pageable);
    }
    @Transactional(readOnly=true)
    public List<Game> getOngoingGames(Pageable pageable) {
        return gr.findByFinishIsNullAndStartIsNotNull(pageable);
    }
}