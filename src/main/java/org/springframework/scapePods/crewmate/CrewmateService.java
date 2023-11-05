package org.springframework.scapePods.crewmate;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CrewmateService {
    CrewmateRepository cr;

    @Autowired
    public CrewmateService(CrewmateRepository cr) {
        this.cr = cr;
    }

    @Transactional
    public Crewmate save(Crewmate c) {
        cr.save(c);
        return c;
    }

    @Transactional(readOnly = true)
    public Optional<Crewmate> getCrewmateById(Integer id) {
        return cr.findById(id);
    }

    @Transactional()
    public void delete() {
        cr.deleteAll();;
    }

}