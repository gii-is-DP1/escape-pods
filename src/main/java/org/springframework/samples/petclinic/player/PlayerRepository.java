package org.springframework.samples.petclinic.player;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface PlayerRepository extends CrudRepository<Player, Integer> {

    List<Player> findAll();      
    Optional<Player> findById(Integer id);
    @Query("SELECT DISTINCT player FROM Player player WHERE player.user.id = :userId")
    public Optional<Player> findByUser(int userId);

    @Query("SELECT player FROM Player player WHERE player.user.username = :username")
    public List<Player> findPlayerByUsername(String username);

}
