package com.codeWithProjects.fitnessTrackerServer.repository;

import com.codeWithProjects.fitnessTrackerServer.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
