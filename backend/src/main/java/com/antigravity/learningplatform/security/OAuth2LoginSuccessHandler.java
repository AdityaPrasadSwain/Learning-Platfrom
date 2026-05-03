package com.antigravity.learningplatform.security;

import com.antigravity.learningplatform.entity.Role;
import com.antigravity.learningplatform.entity.User;
import com.antigravity.learningplatform.repository.UserRepository;
import com.antigravity.learningplatform.service.JwtService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String fullName = oAuth2User.getAttribute("name");
        String firstName = oAuth2User.getAttribute("given_name");
        String lastName = oAuth2User.getAttribute("family_name");

        // Fallback if specific name fields are missing
        if (firstName == null && fullName != null) {
            String[] parts = fullName.split(" ", 2);
            firstName = parts[0];
            if (parts.length > 1) {
                lastName = parts[1];
            }
        }

        Optional<User> userOptional = userRepository.findByEmail(email);
        User user;

        if (userOptional.isPresent()) {
            user = userOptional.get();
            // Update details on login
            if (user.getFirstName() == null && firstName != null)
                user.setFirstName(firstName);
            if (user.getLastName() == null && lastName != null)
                user.setLastName(lastName);
            userRepository.save(user);
        } else {
            // Create new user
            user = new User();
            user.setEmail(email);
            user.setUsername(email); // Use email as username to ensure uniqueness
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setPassword(""); // No password for OAuth users
            user.setRole(Role.STUDENT); // Default role
            user = userRepository.save(user);
        }

        String token = jwtService.generateToken(user);

        String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:5173/oauth2/redirect")
                .queryParam("token", token)
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
