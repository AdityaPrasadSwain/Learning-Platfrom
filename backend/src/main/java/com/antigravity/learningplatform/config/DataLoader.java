package com.antigravity.learningplatform.config;

import org.springframework.stereotype.Component;

/**
 * DataLoader is disabled to prevent application shutdown after initialization.
 * Backend data should be persistent in the database.
 */
@Component
public class DataLoader {
    // Empty - data persistence handled by database
}
