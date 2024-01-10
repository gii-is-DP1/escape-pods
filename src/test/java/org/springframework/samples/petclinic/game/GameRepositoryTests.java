package org.springframework.samples.petclinic.game;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.util.Streamable;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import static org.assertj.core.api.Assertions.*;

@DataJpaTest()
public class GameRepositoryTests {

    @Autowired
    GameRepository gr;

    @Test
    public void getAllGamesTest(){
        Iterable<Game> foundGames=gr.findAll();
        List <Game> foundGames2=Streamable.of(foundGames).toList();
        assertTrue(foundGames2.size()>0);
        assertFalse(foundGames2.isEmpty());
    }
}
