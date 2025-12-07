package com.antigravity.learningplatform.dto;

import com.antigravity.learningplatform.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserManagementDTO {
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private Role role;
    private Boolean isActive;
    private Boolean isSuspended;
    private String suspensionReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
