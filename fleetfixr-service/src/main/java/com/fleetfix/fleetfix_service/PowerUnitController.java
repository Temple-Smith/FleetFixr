package com.fleetfix.fleetfix_service;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/powerunits")
public class PowerUnitController {

    private final PowerUnitService service;

    public PowerUnitController(PowerUnitService service) {
        this.service = service;
    }

    @GetMapping
    public List<PowerUnit> getAll() {
        return service.findAll();
    }

    @PostMapping
    public PowerUnit create(@RequestBody PowerUnit powerUnit) {
        return service.save(powerUnit);
    }

    @PutMapping("/{id}")
    public PowerUnit update(@PathVariable Long id, @RequestBody PowerUnit powerUnit) {
        powerUnit.setId(id);
        return service.update(powerUnit);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteById(id);
    }
}
