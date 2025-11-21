package com.fleetfix.fleetfix_service;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;

@Service
public class FileStorageService {
    private final Path storageDir = Paths.get("uploads");

    public FileStorageService() throws IOException {
        if (!Files.exists(storageDir)) {
            Files.createDirectories(storageDir);
        }
    }

    /**
     * Saves the file and returns the stored filename
     */
    public String save(MultipartFile file, String filename) {
        try {
            Path target = storageDir.resolve(filename);
            Files.write(target, file.getBytes(), StandardOpenOption.CREATE,
                    StandardOpenOption.TRUNCATE_EXISTING);
            return target.toString();
        } catch (IOException e) {
            throw new RuntimeException("Failed to save file: " + filename, e);
        }
    }

    public byte[] loadAsBytes(String path) {
        try {
            return Files.readAllBytes(Paths.get(path));
        } catch (IOException e) {
            throw new RuntimeException("Failed to read file", e);
        }
    }
}
