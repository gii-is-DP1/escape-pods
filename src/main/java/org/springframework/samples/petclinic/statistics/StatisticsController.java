package org.springframework.samples.petclinic.statistics;

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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/statistics")
@Tag(name = "Statisticss", description = "API for the  management of Statisticss.")
@SecurityRequirement(name = "bearerAuth")
public class StatisticsController {
    StatisticsService ss;

    @Autowired
    public StatisticsController(StatisticsService ss){
        this.ss=ss;
    }

    @GetMapping
    public List<Statistics> getAllStatisticss(@ParameterObject @RequestParam(value="status",required = false) String name){
        if(name!=null){
            return ss.getStatisticsByName(name);
        }else 
            return ss.getAllStatisticss();
    }

    @GetMapping("/{id}")
    public Statistics getStatisticsById(@PathVariable("id")Integer id){
        Optional<Statistics> g=ss.getStatisticsById(id);
        if(!g.isPresent())
            throw new ResourceNotFoundException("Statistics", "id", id);
        return g.get();
    }

    @PostMapping()
    public ResponseEntity<Statistics> createStatistics(@Valid @RequestBody Statistics g){
        g=ss.save(g);
        URI location = ServletUriComponentsBuilder
                    .fromCurrentRequest()
                    .path("/{id}")
                    .buildAndExpand(g.getId())
                    .toUri();
        return ResponseEntity.created(location).body(g);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateStatistics(@Valid @RequestBody Statistics g,@PathVariable("id")Integer id){
        Statistics gToUpdate=getStatisticsById(id);
        BeanUtils.copyProperties(g,gToUpdate, "id");
        ss.save(gToUpdate);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStatistics(@PathVariable("id")Integer id){
        if(getStatisticsById(id)!=null)
            ss.delete(id);
        return ResponseEntity.noContent().build();
    }
      
      
}
