package org.springframework.samples.petclinic.gameplayer;
import org.springframework.samples.petclinic.player.Player;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GamePlayerService {

    GamePlayerRepository pr;

    @Autowired
    public GamePlayerService(GamePlayerRepository pr) {
        this.pr = pr;
    }

    @Transactional(readOnly = true)
    public List<GamePlayer> getAllPlayers() {
        return pr.findAll();
    }
    

    @Transactional
    public GamePlayer save(GamePlayer p) {
        pr.save(p);
        return p;
    }

    @Transactional(readOnly = true)
    public Optional<GamePlayer> getPlayerById(Integer id) {
        return pr.findById(id);
    }

    @Transactional(readOnly = true)
    public List<GamePlayer> getGamePlayersByGameId(Integer id) {
        return pr.findByGameId(id);
    }

    @Transactional(readOnly = true)
    public GamePlayer getPlayerByColor(String code) {
        List<GamePlayer> players = pr.findByColor(code);
        return players.isEmpty() ? null : players.get(0);
    }

   

    @Transactional()
    public void delete(Integer id) {
        pr.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<GamePlayer> getPinkPlayer() {
        return pr.findByColor("pink");
    }

    @Transactional(readOnly = true)
    public List<GamePlayer> getBlackPlayer() {
        return pr.findByColor("black");
    }

    @Transactional(readOnly = true)
    public List<GamePlayer> getWhitePlayer() {
        return pr.findByColor("white");
    }

    @Transactional(readOnly = true)
    public List<GamePlayer> getBluePlayer() {
        return pr.findByColor("blue");
    }

    @Transactional(readOnly = true)
    public List<GamePlayer> getYellowPlayer() {
        return pr.findByColor("yellow");
    }
}
