package com.codeWithProjects.fitnessTrackerServer.dto;

import lombok.Data;

@Data
public class UserDTO {
    private String username;
    private String password;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String birthDate;
    private String gender;
    private String countryCity;
    private String profilePhoto;
    private String role;
    private String email;
}
