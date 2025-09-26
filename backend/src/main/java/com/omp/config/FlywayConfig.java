package com.omp.config;

import org.flywaydb.core.api.configuration.FluentConfiguration;
import org.springframework.boot.autoconfigure.flyway.FlywayConfigurationCustomizer;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FlywayConfig implements FlywayConfigurationCustomizer {
	@Override
	public void customize(FluentConfiguration configuration) {
		// Keep defaults from application.properties:
		// locations=classpath:db/migration, baseline-on-migrate=true, baseline-version=0
		// You can tweak schemas, placeholders, or callbacks here if needed.
		// Example:
		// configuration.schemas("public");
	}
}
