package com.antigravity.learningplatform.repository;

import com.antigravity.learningplatform.entity.Role;
import com.antigravity.learningplatform.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

    @Query("SELECT u FROM User u WHERE " +
           "(:search IS NULL OR :search = '' OR LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:role IS NULL OR u.role = :role) " +
           "AND (:isSuspended IS NULL OR u.isSuspended = :isSuspended)")
    Page<User> findUsersWithFilters(@Param("search") String search, @Param("role") Role role, @Param("isSuspended") Boolean isSuspended, Pageable pageable);
}
