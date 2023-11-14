package org.springframework.samples.petclinic.line;
import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LineRepository extends CrudRepository<Line,Integer> {
    List<Line> findAll();
    Optional<Line> findById(Integer id);
}
