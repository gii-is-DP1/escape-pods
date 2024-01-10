package org.springframework.samples.petclinic.game;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

//@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureTestDatabase
public class GameServiceTests {
    private GameService gs;
    private GameRepository gr;

    @Autowired
    public GameServiceTests(GameService gs, GameRepository gr) {
        this.gs = gs;
        this.gr = gr;
    }


    @Test
    public void getAllGamesTest(){
        List<Game> foundGames= this.gs.getAllGames(null);
        assertTrue(foundGames.size()>0);
        assertFalse(foundGames.isEmpty());
    }

}
