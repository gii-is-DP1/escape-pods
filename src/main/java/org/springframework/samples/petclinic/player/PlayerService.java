package org.springframework.samples.petclinic.player;

import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.samples.petclinic.exceptions.ResourceNotFoundException;
import org.springframework.samples.petclinic.owner.Owner;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PlayerService {

    private PlayerRepository playerRepository;

    @Autowired
	public PlayerService(PlayerRepository playerRepository) {
		this.playerRepository = playerRepository;
	}
    
    @Transactional(readOnly = true)
	public Iterable<Player> findAll() throws DataAccessException {
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
		playerRepository.delete(toDelete);
	}
}
