package com.antigravity.learningplatform.config;

import com.antigravity.learningplatform.entity.Role;
import com.antigravity.learningplatform.entity.User;
import com.antigravity.learningplatform.entity.SystemSetting;
import com.antigravity.learningplatform.repository.SystemSettingRepository;
import com.antigravity.learningplatform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.HashMap;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final SystemSettingRepository systemSettingRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = User.builder()
                    .username("admin")
                    .email("admin@example.com")
                    .password(passwordEncoder.encode("admin"))
                    .role(Role.ADMIN)
                    .firstName("Super")
                    .lastName("Admin")
                    .isActive(true)
                    .isApproved(true)
                    .isSuspended(false)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            userRepository.save(admin);
            System.out.println("Default Admin user created: admin / admin");
        }

        if (systemSettingRepository.findBySettingKey("feature_toggles").isEmpty()) {
            Map<String, Object> toggles = new HashMap<>();
            toggles.put("live_class", true);
            toggles.put("assignment", true);
            toggles.put("quiz", true);
            toggles.put("recording", true);
            toggles.put("notifications", true);
            
            SystemSetting featureToggles = SystemSetting.builder()
                    .settingKey("feature_toggles")
                    .value(toggles)
                    .build();
            systemSettingRepository.save(featureToggles);
        }

        if (systemSettingRepository.findBySettingKey("platform_config").isEmpty()) {
            Map<String, Object> config = new HashMap<>();
            config.put("max_upload_size", "50MB");
            config.put("session_timeout", 3600);
            config.put("maintenance_mode", false);
            
            SystemSetting platformConfig = SystemSetting.builder()
                    .settingKey("platform_config")
                    .value(config)
                    .build();
            systemSettingRepository.save(platformConfig);
        }
    }
}
