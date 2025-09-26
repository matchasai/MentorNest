package com.omp.controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/debug")
public class DebugController {
	@GetMapping
	public ResponseEntity<Map<String, Object>> debug(Principal principal) {
		Map<String, Object> out = new HashMap<>();
		out.put("principal", principal != null ? principal.getName() : null);
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		out.put("authenticated", auth != null && auth.isAuthenticated());
		out.put("authorities", auth != null ? auth.getAuthorities() : null);
		return ResponseEntity.ok(out);
	}
}

