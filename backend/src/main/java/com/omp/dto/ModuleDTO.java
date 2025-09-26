package com.omp.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ModuleDTO {
    private String id;
    @NotBlank
    private String title;
    @NotBlank
    private String videoUrl;
    @NotBlank
    private String summary;
    private String courseId;
    private String resourceUrl;

    public String getResourceUrl() {
        return resourceUrl;
    }

    public void setResourceUrl(String resourceUrl) {
        this.resourceUrl = resourceUrl;
    }
}