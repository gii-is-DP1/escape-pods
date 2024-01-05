package org.springframework.samples.petclinic.sector;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SectorService {

    private SectorRepository s;

    @Autowired
    public SectorService(SectorRepository s) throws DataAccessException {
        this.s = s;
    }

    @Transactional(readOnly = true)
    public List<Sector> getAllSectors() throws DataAccessException {
        return s.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Sector> getSectorById(Integer id) throws DataAccessException {
        return s.findById(id);
    }

    @Transactional
    public Sector save(Sector sec) throws DataAccessException {
        s.save(sec);
        return sec;
    }

    @Transactional(readOnly = true)
    public List<Sector> getSectorScrapped(Boolean scrap) throws DataAccessException {
        return s.findByScrap(scrap);
    }

    @Transactional()
    public List<Sector> getAllSectorsByGameId(Integer gameId) throws DataAccessException {
        return s.findByGameId(gameId);
    }

    @Transactional
    public void delete(Integer id) throws DataAccessException {
        s.deleteById(id);
    }
}
