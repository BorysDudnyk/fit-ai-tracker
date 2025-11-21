package com.codeWithProjects.fitnessTrackerServer.services.user;

import com.codeWithProjects.fitnessTrackerServer.dto.UserDTO;
import com.codeWithProjects.fitnessTrackerServer.entity.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @PersistenceContext
    private EntityManager em;

    @Override
    @Transactional
    public User register(UserDTO userDTO) {
        // перевірка, чи існує username
        List<User> existingUsers = em.createQuery(
                        "SELECT u FROM User u WHERE u.username = :username", User.class)
                .setParameter("username", userDTO.getUsername())
                .getResultList();

        if (!existingUsers.isEmpty()) {
            return null;
        }

        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setPassword(userDTO.getPassword());
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setPhoneNumber(userDTO.getPhoneNumber());
        user.setBirthDate(userDTO.getBirthDate());
        user.setGender(userDTO.getGender());
        user.setCountryCity(userDTO.getCountryCity());
        user.setProfilePhoto(userDTO.getProfilePhoto());
        user.setRole(userDTO.getRole() != null ? userDTO.getRole() : "USER");
        user.setEmail(userDTO.getEmail());

        em.persist(user);
        return user;
    }

    @Override
    public boolean login(UserDTO userDTO) {
        // пошук користувача за email
        List<User> users = em.createQuery(
                        "SELECT u FROM User u WHERE u.email = :email", User.class)
                .setParameter("email", userDTO.getEmail())
                .getResultList();

        if (users.isEmpty()) return false;

        User user = users.get(0);
        return user.getPassword().equals(userDTO.getPassword());
    }
}
