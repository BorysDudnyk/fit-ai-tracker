package com.codeWithProjects.fitnessTrackerServer.controller;

import com.codeWithProjects.fitnessTrackerServer.dto.UserDTO;
import com.codeWithProjects.fitnessTrackerServer.entity.User;
import com.codeWithProjects.fitnessTrackerServer.services.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody UserDTO userDTO) {
        User user = userService.register(userDTO);
        Map<String, Object> response = new HashMap<>();
        if(user == null) {
            response.put("success", false);
            response.put("message", "Користувач вже існує!");
            return ResponseEntity.badRequest().body(response);
        }
        response.put("success", true);
        response.put("message", "Реєстрація успішна!");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody UserDTO userDTO) {
        boolean success = userService.login(userDTO);
        Map<String, Object> response = new HashMap<>();
        if(success) {
            response.put("success", true);
            response.put("message", "Вхід успішний!");
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Невірний логін або пароль!");
            return ResponseEntity.status(401).body(response);
        }
    }
}
