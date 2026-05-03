package com.antigravity.learningplatform.controller;

import com.antigravity.learningplatform.entity.SystemSetting;
import com.antigravity.learningplatform.entity.User;
import com.antigravity.learningplatform.service.SettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SettingsController {

    private final SettingsService settingsService;

    // User Settings Endpoints
    @GetMapping("/settings/{userId}")
    public ResponseEntity<Map<String, Object>> getUserSettings(@PathVariable Long userId) {
        return ResponseEntity.ok(settingsService.getUserSettings(userId));
    }

    @PostMapping("/settings/update/{userId}")
    public ResponseEntity<String> updateUserSettings(@PathVariable Long userId, @RequestBody Map<String, Object> settings) {
        settingsService.updateUserSettings(userId, settings);
        return ResponseEntity.ok("User settings updated successfully");
    }

    // System Settings Endpoints (Admin Only)
    @GetMapping("/system/settings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SystemSetting>> getAllSystemSettings() {
        return ResponseEntity.ok(settingsService.getAllSystemSettings());
    }

    @PostMapping("/system/settings/update")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> updateSystemSetting(@RequestBody Map<String, Object> payload) {
        String key = (String) payload.get("key");
        @SuppressWarnings("unchecked")
        Map<String, Object> value = (Map<String, Object>) payload.get("value");
        
        User admin = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        settingsService.updateSystemSetting(key, value, admin.getId());
        return ResponseEntity.ok("System setting updated successfully");
    }

    @GetMapping("/system/feature-toggles")
    public ResponseEntity<Map<String, Object>> getFeatureToggles() {
        return ResponseEntity.ok(settingsService.getSystemSettingValue("feature_toggles"));
    }
}
