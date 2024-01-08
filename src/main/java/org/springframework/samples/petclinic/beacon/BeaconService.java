package org.springframework.samples.petclinic.beacon;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

@Service
public class BeaconService {

    private BeaconRepository br;

    @Autowired
    public BeaconService(BeaconRepository br) throws DataAccessException {
        this.br = br;
    }

    @Transactional(readOnly = true)
    public List<Beacon> getAllBeacons() throws DataAccessException {
        return br.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Beacon> getBeaconById(Integer id) throws DataAccessException {
        return br.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Beacon> getBeaconByColor(String color1) throws DataAccessException {
        return br.findByColor1(color1);
    }

    @Transactional(readOnly = true)
    public List<Beacon> getBeaconsByGameId(Integer id) throws DataAccessException {
        return br.findByGameId(id);
    }

    @Transactional
    public Beacon save(Beacon b) throws DataAccessException {
        br.save(b);
        return b;
    }

    @Transactional
    public void delete(Integer id) throws DataAccessException {
        br.deleteById(id);
    }

    @Transactional
    public void deleteByGameId(Integer id) throws DataAccessException {
        br.deleteByGameId(id);
    }

}
