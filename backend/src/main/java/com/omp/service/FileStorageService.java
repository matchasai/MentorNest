package com.omp.service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@Service
public class FileStorageService {

    private final Path rootLocation;

    public FileStorageService(@Value("${file.upload-dir}") String uploadDir) {
        this.rootLocation = Paths.get(uploadDir);
        initializeStorage();
    }

    private void initializeStorage() {
        try {
            // Create main uploads directory
            Files.createDirectories(rootLocation);

            // Create subdirectories
            Files.createDirectories(rootLocation.resolve("certificates"));
            Files.createDirectories(rootLocation.resolve("payments"));
            Files.createDirectories(rootLocation.resolve("courses"));

            System.out.println("File storage initialized successfully at: " + rootLocation.toAbsolutePath());
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage", e);
        }
    }

    public String store(MultipartFile file) {
        if (file.isEmpty()) {
            return null;
        }

        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, this.rootLocation.resolve(filename), StandardCopyOption.REPLACE_EXISTING);
            return ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/uploads/")
                    .path(filename)
                    .toUriString();
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file " + filename, e);
        }
    }

    public String storeFile(MultipartFile file, String subdirectory) {
        try {
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path dirPath = rootLocation.resolve(subdirectory);
            Files.createDirectories(dirPath);
            Path filePath = dirPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            return fileName;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }

    public String storeCertificate(byte[] imageBytes, String fileName) {
        try {
            System.out.println("Storing certificate: " + fileName);
            Path dirPath = rootLocation.resolve("certificates");
            Files.createDirectories(dirPath);
            Path filePath = dirPath.resolve(fileName);

            try (ByteArrayInputStream inputStream = new ByteArrayInputStream(imageBytes)) {
                Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
            }

            String fileUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/uploads/certificates/")
                    .path(fileName)
                    .toUriString();

            System.out.println("Certificate stored successfully at: " + fileUrl);
            return fileUrl;
        } catch (IOException e) {
            System.err.println("Failed to store certificate: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to store certificate", e);
        }
    }
}