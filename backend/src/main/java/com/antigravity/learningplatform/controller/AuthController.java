package com.antigravity.learningplatform.controller;

import com.antigravity.learningplatform.dto.AuthenticationRequest;
import com.antigravity.learningplatform.dto.AuthenticationResponse;
import com.antigravity.learningplatform.dto.ForgotPasswordRequest;
import com.antigravity.learningplatform.dto.RegisterRequest;
import com.antigravity.learningplatform.dto.ResetPasswordRequest;
import com.antigravity.learningplatform.service.AuthenticationService;
import com.antigravity.learningplatform.service.PasswordResetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService service;
    private final PasswordResetService passwordResetService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(service.authenticate(request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Boolean> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        boolean exists = passwordResetService.checkEmailExists(request.getEmail());
        return ResponseEntity.ok(exists);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        boolean result = passwordResetService.resetPasswordByEmail(request.getEmail(), request.getNewPassword());
        if (result) {
            return ResponseEntity.ok("Password successfully reset.");
        } else {
            return ResponseEntity.badRequest().body("Failed to reset password. User not found.");
        }
    }
}
