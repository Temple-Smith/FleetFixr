package com.fleetfix.fleetfix_service;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/powerunits")
public class PowerUnitController {

    private final PowerUnitService service;
    private final PowerUnitRepository repo;
    private final FileStorageService fileService;

    public PowerUnitController(PowerUnitService service, FileStorageService fileService, PowerUnitRepository repo) {
        this.service = service;
        this.repo = repo;
        this.fileService = fileService;
    }

    @GetMapping
    public List<PowerUnit> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}/cvip")
    public ResponseEntity<byte[]> getCvip(@PathVariable Long id) {
        PowerUnit unit = repo.findById(id).orElseThrow();

        if (unit.getCvipPath() == null || unit.getCvipPath().isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        byte[] fileBytes = fileService.loadAsBytes(unit.getCvipPath());

        return ResponseEntity.ok()
                .header("Content-Type", "application/pdf").header("Content-Disposition", "inline; filename=\"cvip-" + id + ".pdf\"").body(fileBytes);
        }

    @PostMapping("/cvip/upload")
    public ResponseEntity<?> uploadCvipByVin(
            @RequestParam("vin") String vin,
            @RequestParam("file") MultipartFile file) {

        try {
            // 1. Find the PU by VIN
            Optional<PowerUnit> puOpt = repo.findByVin(vin);

            if (puOpt.isEmpty()) {
                return ResponseEntity
                        .badRequest()
                        .body("No Power Unit found with VIN: " + vin);
            }

            PowerUnit pu = puOpt.get();

            // 2. Validate file type (optional but recommended)
            if (!file.getOriginalFilename().toLowerCase().endsWith(".pdf")) {
                return ResponseEntity
                        .badRequest()
                        .body("Only PDF files are allowed.");
            }

            // 3. Define save path
            String filename = "cvip_" + vin + ".pdf";
            Path savePath = Paths.get("cvip_uploads").resolve(filename);

            Files.createDirectories(savePath.getParent());
            Files.write(savePath, file.getBytes());

            // 4. Update power unit with cvipPath
            pu.setCvipPath(savePath.toString());
            repo.save(pu);

            return ResponseEntity.ok("CVIP saved for VIN " + vin);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error uploading CVIP.");
        }
    }


    @PostMapping
    public PowerUnit create(@RequestBody PowerUnit powerUnit) {
        return service.save(powerUnit);
    }
    @PostMapping("/{id}/cvip")
    public ResponseEntity<?> uploadCvip(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        PowerUnit unit = repo.findById(id).orElseThrow(() -> new RuntimeException ("PowerUnit not found: " + id));
        String filename = fileService.save(file, "cvip-" + id + ".pdf");
        String storedFilename = fileService.save(file, filename);

        unit.setCvipPath(storedFilename);

        repo.save(unit);

        return ResponseEntity.ok("Uploaded");
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
