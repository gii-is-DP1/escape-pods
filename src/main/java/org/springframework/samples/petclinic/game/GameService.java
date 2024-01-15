package org.springframework.samples.petclinic.game;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Pageable;
import org.springframework.samples.petclinic.gameplayer.GamePlayerRepository;
import org.springframework.samples.petclinic.player.Player;

@Service
public class GameService {

    private GameRepository gr;
    private GamePlayerRepository gpr;

    @Autowired
    public GameService(GameRepository gr, GamePlayerRepository gpr) throws DataAccessException {
        this.gr = gr;
        this.gpr = gpr;
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
        if (g.getStatus() == GameStatus.PLAYING) {
            if (!((g.getPlayers().size() >= 2) && (g.getPlayers().size() <= 5))) {
                throw new IllegalArgumentException("The game must have between 2 and 5 players");
            }
        }
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

    @Transactional
    public Game addPlayer(Game g, Player p) throws DataAccessException {
        if (g.getPlayers().size() < g.getNumPlayers() && !g.getPlayers().contains(p)) {
            g.getPlayers().add(p);
        } else {
            throw new IllegalArgumentException("The game is full or you are already in it");
        }
        return g;
    }

    @Transactional
    public Game nextTurn(Game g, boolean lastRound) throws DataAccessException {
        List<Player> players = g.getPlayers();
        int index = g.getPlayers().indexOf(g.getActivePlayer());
        if (lastRound) {
            gpr.findByPlayerId(g.getActivePlayer().getId()).setNoMoreTurns(true);
            ;
        }
        if (index == players.size() - 1) {
            g.setActivePlayer(players.get(0));
        } else {
            g.setActivePlayer(players.get(index + 1));
        }

        return g;
    }

    @Transactional
    public void finishGame(Game g) throws DataAccessException {
        g.setFinish(LocalDateTime.now());
        g.setStatus(GameStatus.FINISHED);
    }
}