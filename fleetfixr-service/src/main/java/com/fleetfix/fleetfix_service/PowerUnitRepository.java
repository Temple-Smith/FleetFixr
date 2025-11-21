package com.fleetfix.fleetfix_service;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

public interface PowerUnitRepository extends JpaRepository<PowerUnit, Long> {
     Optional<PowerUnit> findByVin(String vin);
}
