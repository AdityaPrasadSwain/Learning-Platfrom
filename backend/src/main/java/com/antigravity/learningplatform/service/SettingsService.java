package com.antigravity.learningplatform.service;

import com.antigravity.learningplatform.entity.AuditLog;
import com.antigravity.learningplatform.entity.SystemSetting;
import com.antigravity.learningplatform.entity.User;
import com.antigravity.learningplatform.entity.UserSetting;
import com.antigravity.learningplatform.repository.AuditLogRepository;
import com.antigravity.learningplatform.repository.SystemSettingRepository;
import com.antigravity.learningplatform.repository.UserRepository;
import com.antigravity.learningplatform.repository.UserSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SettingsService {

    private final UserSettingRepository userSettingRepository;
    private final SystemSettingRepository systemSettingRepository;
    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;

    @Transactional(readOnly = true)
    public Map<String, Object> getUserSettings(Long userId) {
        return userSettingRepository.findByUserId(userId)
                .map(UserSetting::getSettings)
                .orElse(getDefaultUserSettings());
    }

    @Transactional
    public void updateUserSettings(Long userId, Map<String, Object> newSettings) {
        UserSetting userSetting = userSettingRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found"));
                    return UserSetting.builder().user(user).settings(new HashMap<>()).build();
                });

        Map<String, Object> currentSettings = userSetting.getSettings();
        if (currentSettings == null) currentSettings = new HashMap<>();
        currentSettings.putAll(newSettings);
        userSetting.setSettings(currentSettings);
        userSettingRepository.save(userSetting);
    }

    @Transactional(readOnly = true)
    public List<SystemSetting> getAllSystemSettings() {
        return systemSettingRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getSystemSettingValue(String key) {
        return systemSettingRepository.findBySettingKey(key)
                .map(SystemSetting::getValue)
                .orElse(new HashMap<>());
    }

    @Transactional
    public void updateSystemSetting(String key, Map<String, Object> value, Long adminId) {
        SystemSetting setting = systemSettingRepository.findBySettingKey(key)
                .orElseGet(() -> SystemSetting.builder().settingKey(key).build());
        setting.setValue(value);
        systemSettingRepository.save(setting);

        // Audit Log
        AuditLog log = AuditLog.builder()
                .action("UPDATE_SYSTEM_SETTING")
                .entityType("SYSTEM_SETTING")
                .entityId(setting.getId())
                .adminId(adminId)
                .details("Updated " + key + " to " + value.toString())
                .build();
        auditLogRepository.save(log);
    }

    public boolean isFeatureEnabled(String featureName) {
        Map<String, Object> toggles = getSystemSettingValue("feature_toggles");
        Object enabled = toggles.get(featureName);
        return enabled != null && (boolean) enabled;
    }

    private Map<String, Object> getDefaultUserSettings() {
        Map<String, Object> defaults = new HashMap<>();
        defaults.put("theme", "dark");
        defaults.put("language", "en");
        Map<String, Object> notifications = new HashMap<>();
        notifications.put("assignment", true);
        notifications.put("quiz", true);
        notifications.put("live", true);
        defaults.put("notifications", notifications);
        return defaults;
    }
}
