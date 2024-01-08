package org.springframework.samples.petclinic.gameplayer;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GamePlayerService {

    private GamePlayerRepository pr;

    @Autowired
    public GamePlayerService(GamePlayerRepository pr) throws DataAccessException {
        this.pr = pr;
    }

    @Transactional(readOnly = true)
    public List<GamePlayer> getAllGamePlayers() throws DataAccessException {
        return pr.findAll();
    }

    @Transactional
    public GamePlayer save(GamePlayer p) throws DataAccessException {
        pr.save(p);
        return p;
    }

    @Transactional(readOnly = true)
    public Optional<GamePlayer> getGamePlayerById(Integer id) throws DataAccessException {
        return pr.findById(id);
    }

    @Transactional(readOnly = true)
    public List<GamePlayer> getGamePlayersByGameId(Integer id) throws DataAccessException {
        return pr.findByGameId(id);
    }


    @Transactional
    public void delete(Integer id) throws DataAccessException {
        pr.deleteById(id);
    }

    @Transactional
    public void deleteByGameId(Integer id) throws DataAccessException {
        pr.deleteByGameId(id);
    }

}
