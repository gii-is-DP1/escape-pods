package org.springframework.samples.petclinic.pod;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PodService {

    private PodRepository p;

    @Autowired
    public PodService(PodRepository p) {
        this.p = p;
    }

    @Transactional(readOnly = true)
    public List<Pod> getAllPodss() throws DataAccessException {
        return p.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Pod> getPodsById(Integer id) throws DataAccessException {
        return p.findById(id);
    }

    @Transactional
    public Pod save(Pod pod) throws DataAccessException {
        p.save(pod);
        return pod;
    }

    @Transactional(readOnly = true)
    public List<Pod> getPodsByCapacity(Integer capacity) throws DataAccessException {
        return p.findByCapacity(capacity);
    }

    @Transactional(readOnly = true)
    public List<Pod> getPodsByEmptySlots(Integer emptySlots) throws DataAccessException {
        return p.findByEmptySlots(emptySlots);
    }

    @Transactional(readOnly = true)
    public List<Pod> getPodsByGameId(Integer id) throws DataAccessException {
        return p.findByGameId(id);
    }

    @Transactional
    public void delete(Integer id) throws DataAccessException {
        p.deleteById(id);
    }
}