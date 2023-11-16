package org.springframework.samples.petclinic.player;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PlayerService {

    PlayerRepository pr;

    @Autowired
    public PlayerService(PlayerRepository pr){
        this.pr=pr;
    }

    @Transactional(readOnly=true)
    public List<Player> getAllPlayers(){
        return pr.findAll();
    }
    /* NO SE MUY BIEN COMO FUNCIONA
    @Transactional(readOnly=true)
    public List<Player> getPlayersByColor(String colorpattern){
        return pr.findAll();
    }*/

    @Transactional
    public Player save(Player p) {
        pr.save(p);
        return p;
    }
<<<<<<< HEAD

    @Transactional(readOnly = true)
    public Optional<Player> getPlayerById(Integer id) {
        return pr.findById(id);
    }

    @Transactional(readOnly = true)
    public Player getPlayerByColor(String code) {
        List<Player> players = pr.findByColor(code);
        return players.isEmpty() ? null : players.get(0);
=======
    @Transactional(readOnly=true)
    public Optional<Player> getPlayerById(Integer id) {        
        return pr.findById(id);
    }
    @Transactional(readOnly=true)
    public Player getPlayerByColor(String code){
        List<Player> players=pr.findByColor(code);
        return players.isEmpty()?null:players.get(0);
>>>>>>> main
    }

    @Transactional()
    public void delete(Integer id) {
        pr.deleteById(id);
    }
<<<<<<< HEAD

    @Transactional(readOnly = true)
    public List<Player> getPinkPlayer() {
        return pr.findByColor("pink");
    }

    @Transactional(readOnly = true)
    public List<Player> getBlackPlayer() {
        return pr.findByColor("black");
    }

    @Transactional(readOnly = true)
    public List<Player> getWhitePlayer() {
        return pr.findByColor("white");
    }

    @Transactional(readOnly = true)
    public List<Player> getBluePlayer() {
        return pr.findByColor("blue");
    }

    @Transactional(readOnly = true)
    public List<Player> getYellowPlayer() {
        return pr.findByColor("yellow");
    }
}
=======
    @Transactional(readOnly=true)
    public List<Player> getPinkPlayer() {
        return pr.findByColor("pink");
    }
    @Transactional(readOnly=true)
    public List<Player> getBlackPlayer() {
        return pr.findByColor("black");
    }
    @Transactional(readOnly=true)
    public List<Player> getWhitePlayer() {
        return pr.findByColor("white");
    }
    @Transactional(readOnly=true)
    public List<Player> getBluePlayer() {
        return pr.findByColor("blue");
    }
    @Transactional(readOnly=true)
    public List<Player> getYellowPlayer() {
        return pr.findByColor("yellow");
    }
}
>>>>>>> main
