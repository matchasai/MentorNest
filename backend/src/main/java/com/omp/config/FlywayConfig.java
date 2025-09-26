package com.omp.config;

import org.springframework.context.annotation.Configuration;

/**
 * Flyway is disabled as part of the MongoDB migration. This class remains as a
 * no-op to avoid configuration errors if referenced elsewhere.
 */
@Configuration
public class FlywayConfig {
    // Intentionally left blank
}
