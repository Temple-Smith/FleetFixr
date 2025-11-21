package com.fleetfix.fleetfix_service;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PowerUnitService {
    private final PowerUnitRepository repository;
    /*public PowerUnitService(PowerUnitRepository repository) {
        this.repository = repository;
    }*/

    public Optional<PowerUnit> findByVin(String vin) {
        return repository.findByVin(vin);
    }

    public void saveCvipPdf(String vin, byte[] pdfBytes) {
        // 1. Find the PowerUnit by VIN
        PowerUnit unit = repository.findByVin(vin)
                .orElseThrow(() -> new RuntimeException("Vin Not Found"));

        // 2. Set the PDF bytes
        unit.setCvipPdf(pdfBytes);

        // 3. Save the updated entity
        repository.save(unit);

    }

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
