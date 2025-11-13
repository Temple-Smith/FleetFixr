package com.fleetfix.fleetfix_service;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PowerUnitService {
    private final PowerUnitRepository repository;

    public PowerUnitService(PowerUnitRepository repository) {
        this.repository = repository;
    }

    public List<PowerUnit> findAll() {
        return repository.findAll();
    }

    public PowerUnit save(PowerUnit powerUnit) {
        return repository.save(powerUnit);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    public PowerUnit update(PowerUnit powerUnit) {
        return repository.save(powerUnit); //save() updates if ID exists
    }
}
