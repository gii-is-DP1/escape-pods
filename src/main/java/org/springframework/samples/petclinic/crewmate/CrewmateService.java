package org.springframework.samples.petclinic.crewmate;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CrewmateService {
    private CrewmateRepository cr;

    @Autowired
    public CrewmateService(CrewmateRepository cr) throws DataAccessException {
        this.cr = cr;
    }

    @Transactional
    public Crewmate save(Crewmate c) throws DataAccessException {
        if (c.getShelterCard() != null && c.getArrivalOrder() == null) {
            c.setArrivalOrder(cr.countByShelterCardId(c.getShelterCard().getId()));
        }
        cr.save(c);
        return c;
    }

    @Transactional(readOnly = true)
    public Optional<Crewmate> getCrewmateById(Integer id) throws DataAccessException {
        return cr.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Crewmate> getAllCrewmates() throws DataAccessException {
        return cr.findAll();
    }

    @Transactional(readOnly = true)
    public List<Crewmate> getAllCrewmatesByGameId(Integer gameId) throws DataAccessException {
        return cr.findByGameId(gameId);
    }

    @Transactional
    public void deleteById(Integer id) throws DataAccessException {
        cr.deleteById(id);
    }

    @Transactional
    public void deleteByGameId(Integer id) throws DataAccessException {
        cr.deleteByGameId(id);
    }

}