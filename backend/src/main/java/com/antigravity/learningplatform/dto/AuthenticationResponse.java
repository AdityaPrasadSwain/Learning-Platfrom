package com.antigravity.learningplatform.dto;

import com.antigravity.learningplatform.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse {
    private String token;
    private String username;
    private Role role;
    private Long userId;
    private Boolean isApproved;
}
