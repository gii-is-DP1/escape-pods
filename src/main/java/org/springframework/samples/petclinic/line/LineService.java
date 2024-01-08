package org.springframework.samples.petclinic.line;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LineService {

    private LineRepository lr;

    @Autowired
    public LineService(LineRepository lrp) {
        this.lr = lrp;
    }

    @Transactional(readOnly = true)
    public List<Line> getAllLines() throws DataAccessException {
        return lr.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Line> getLineById(Integer id) throws DataAccessException {
        return lr.findById(id);
    }

    @Transactional
    public Line save(Line l) throws DataAccessException {
        lr.save(l);
        return l;
    }

    @Transactional()
    public void delete(Integer id) throws DataAccessException {
        lr.deleteById(id);
    }

    @Transactional()
    public void deleteByGameId(Integer id) throws DataAccessException{
        lr.deleteByGameId(id);
    }

    @Transactional(readOnly = true)
    public List<Line> getAllLinesByGameId(Integer gameId) throws DataAccessException {
        return lr.findByGameId(gameId);
    }
}