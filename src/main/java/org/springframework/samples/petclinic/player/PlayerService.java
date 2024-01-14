package org.springframework.samples.petclinic.player;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.samples.petclinic.exceptions.ResourceNotFoundException;
import org.springframework.samples.petclinic.game.Game;
import org.springframework.samples.petclinic.game.GameRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PlayerService {

    private PlayerRepository playerRepository;

    private GameRepository gameRepository;

    @Autowired
	public PlayerService(PlayerRepository playerRepository, GameRepository gameRepository) {
		this.playerRepository = playerRepository;
		this.gameRepository = gameRepository;
	}
    
    @Transactional(readOnly = true)
	public List<Player> findAll() throws DataAccessException {
		return playerRepository.findAll();
	}

    @Transactional(readOnly = true)
	public Player findPlayerById(int id) throws DataAccessException {
		return this.playerRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Player", "ID", id));
	}

    @Transactional(readOnly = true)
	public Optional<Player> optFindPlayerSByUser(int userId) throws DataAccessException {
		return this.playerRepository.findByUser(userId);
	}

    @Transactional
	public Player savePlayer(Player player) throws DataAccessException {
		playerRepository.save(player);
		return player;
	}

    @Transactional
	public Player updatePlayer(Player player, int id) throws DataAccessException {
		Player toUpdate = findPlayerById(id);
		BeanUtils.copyProperties(player, toUpdate, "id", "user");
		return savePlayer(toUpdate);
	}

    @Transactional
	public void deletePlayer(int id) throws DataAccessException {
		Player toDelete = findPlayerById(id);

		for (Game game : gameRepository.findPlayerGames(id)) {
        game.removePlayer(toDelete);
		gameRepository.save(game);
    }

		playerRepository.delete(toDelete);
	}

	@Transactional(readOnly = true)
	public List<Player> findPlayerByUsername(String username){
		return playerRepository.findPlayerByUsername(username);
	}
}
