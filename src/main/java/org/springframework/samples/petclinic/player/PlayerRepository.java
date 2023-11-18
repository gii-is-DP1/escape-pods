package org.springframework.samples.petclinic.player;

import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface PlayerRepository extends CrudRepository<Player, Integer> {
    
    @Query("SELECT DISTINCT player FROM Player player WHERE player.user.id = :userId")
	public Optional<Player> findByUser(int userId);

}
