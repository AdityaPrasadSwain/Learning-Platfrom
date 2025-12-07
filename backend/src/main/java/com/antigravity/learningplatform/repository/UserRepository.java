package com.antigravity.learningplatform.repository;

import com.antigravity.learningplatform.entity.Role;
import com.antigravity.learningplatform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    
    // Admin queries
    Long countByRole(Role role);
    Long countByIsActive(Boolean isActive);
    Long countByIsSuspended(Boolean isSuspended);
    List<User> findByUsernameContainingOrEmailContaining(String username, String email);
}
