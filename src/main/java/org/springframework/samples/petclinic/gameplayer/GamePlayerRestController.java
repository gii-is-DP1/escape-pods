package org.springframework.samples.petclinic.gameplayer;

import java.net.URI;
import java.util.List;
import java.util.Optional;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.samples.petclinic.exceptions.ResourceNotFoundException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

//creación de operaciones crud

@RestController
@RequestMapping("/api/v1/gamePlayers")
@Tag(name = "gamePlayers", description = "API for the  management of  gamePlayers.")
@SecurityRequirement(name = "bearerAuth")
public class GamePlayerRestController {
    GamePlayerService ps;
    @Autowired
    public GamePlayerRestController(GamePlayerService ps){
        this.ps=ps;
    }

    @GetMapping
    public List<GamePlayer> getAllPlayers(@ParameterObject() @RequestParam(value="color",required = false) Color color){
        if(color!=null){
            switch(color){
                case PINK:
                    return ps.getPinkPlayer();
                    
                case BLACK:
                    return ps.getBlackPlayer();
                case WHITE:
                    return ps.getWhitePlayer();
                case BLUE:
                    return ps.getBluePlayer();
                default:
                    return ps.getYellowPlayer();
            }
        }else{
            return ps.getAllPlayers();
        }
    }

    @GetMapping("/{id}")
    public GamePlayer getPlayerById(@PathVariable("id")Integer id){
        Optional<GamePlayer> p=ps.getPlayerById(id);
        if(!p.isPresent())
            throw new ResourceNotFoundException("gamePlayer", "id", id);
        return p.get();
    }

    @PostMapping()
    public ResponseEntity<GamePlayer> createGame(@Valid @RequestBody GamePlayer p){
        p=ps.save(p);
        URI location = ServletUriComponentsBuilder
                    .fromCurrentRequest()
                    .path("/{id}")
                    .buildAndExpand(p.getId())
                    .toUri();
        return ResponseEntity.created(location).body(p);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updatePlayer(@Valid @RequestBody GamePlayer p,@PathVariable("id")Integer id){
        GamePlayer pToUpdate=getPlayerById(id);
        //el copy properties parece que necesita los datos a alterar,
        //un nombre de la actualizacion y el id del juego que se actualizara
        BeanUtils.copyProperties(p,pToUpdate, "id");
        ps.save(pToUpdate);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlayer(@PathVariable("id")Integer id){
        if(getPlayerById(id)!=null)
            ps.delete(id);
        return ResponseEntity.noContent().build();
    }
    
}
