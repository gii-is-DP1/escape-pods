package org.springframework.samples.petclinic.slotInfo;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SlotInfoService {

    private SlotInfoRepository si;

    @Autowired
    public SlotInfoService(SlotInfoRepository si) {
        this.si = si;
    }

    @Transactional(readOnly = true)
    public List<SlotInfo> getAllSlotInfos() throws DataAccessException {
        return si.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<SlotInfo> getSlotInfoById(Integer id) throws DataAccessException {
        return si.findById(id);
    }

    @Transactional
    public SlotInfo save(SlotInfo g) throws DataAccessException {
        si.save(g);
        return g;
    }
    
    @Transactional(readOnly = true)
    public List<SlotInfo> getSlotInfoByGameId(Integer id) throws DataAccessException {
        return si.findByGameId(id);
    }

    @Transactional
    public void delete(Integer id) throws DataAccessException {
        si.deleteById(id);
    }

    @Transactional
    public void deleteByGameId(Integer id) throws DataAccessException {
        si.deleteByGameId(id);
    }
}
