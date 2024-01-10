package org.springframework.samples.petclinic.game;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Pageable;
import org.springframework.samples.petclinic.player.Player;

@Service
public class GameService {

     private GameRepository gr;

    @Autowired
    public GameService(GameRepository gr) throws DataAccessException {
        this.gr = gr;
    }

    @Transactional(readOnly = true)
    public List<Game> getAllGames(Pageable pageable) throws DataAccessException {
        return gr.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public List<Game> getGamesByPlayerId(Pageable paging, Integer playerId) throws DataAccessException {
        return gr.findByPlayerId(paging, playerId);
    }

    @Transactional(readOnly = true)
    public List<Game> getWaitingGames(Pageable pageable) throws DataAccessException {
        return gr.findByStatus(GameStatus.WAITING, pageable);
    }

    @Transactional
    public Game save(Game g) throws DataAccessException {
        gr.save(g);
        return g;
    }

    @Transactional(readOnly = true)
    public Optional<Game> getGameById(Integer id) throws DataAccessException {
        return gr.findById(id);
    }

    @Transactional()
    public void delete(Integer id) throws DataAccessException {
        gr.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<Game> getFinishedGames(Pageable pageable) throws DataAccessException {
        return gr.findByStatus(GameStatus.FINISHED, pageable);
    }

    @Transactional(readOnly = true)
    public List<Game> getOngoingGames(Pageable pageable) throws DataAccessException {
        return gr.findByFinishIsNullAndStartIsNotNull(pageable);
    }
}