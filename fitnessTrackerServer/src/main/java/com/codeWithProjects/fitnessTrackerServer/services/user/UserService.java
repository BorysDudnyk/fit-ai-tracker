package com.codeWithProjects.fitnessTrackerServer.services.user;

import com.codeWithProjects.fitnessTrackerServer.dto.UserDTO;
import com.codeWithProjects.fitnessTrackerServer.entity.User;

public interface UserService {
    User register(UserDTO userDTO);
    boolean login(UserDTO userDTO);
}
