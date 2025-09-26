package com.omp.controller;

import java.time.Instant;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

	@GetMapping
	public ResponseEntity<Map<String, Object>> health() {
		Map<String, Object> body = new HashMap<>();
		body.put("status", "ok");
		body.put("time", Instant.now().toString());
		return ResponseEntity.ok(body);
	}
}

