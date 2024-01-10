package org.springframework.samples.petclinic.shelterCard;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ShelterCardService {

    private ShelterCardRepository sc;

    @Autowired
    public ShelterCardService(ShelterCardRepository sc) {
        this.sc = sc;
    }

    @Transactional(readOnly = true)
    public List<ShelterCard> getAllShelterCards() throws DataAccessException {
        return sc.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<ShelterCard> getShelterCardById(Integer id) throws DataAccessException {
        return sc.findById(id);
    }

    @Transactional
    public ShelterCard save(ShelterCard g) throws DataAccessException {
        sc.save(g);
        return g;
    }

    @Transactional(readOnly = true)
    public List<ShelterCard> getShelterCardByType(Type type) throws DataAccessException {
        return sc.findByType(type);
    }

    @Transactional(readOnly = true)
    public List<ShelterCard> getShelterCardByGameId(Integer id) throws DataAccessException {
        return sc.findByGameId(id);
    }

    @Transactional
    public void delete(Integer id) throws DataAccessException {
        sc.deleteById(id);
    }

    @Transactional
    public void deleteByGameId(Integer id) throws DataAccessException {
        sc.deleteByGameId(id);
    }
}
