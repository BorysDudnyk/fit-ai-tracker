package com.codeWithProjects.fitnessTrackerServer.dto;

import lombok.Data;

import java.util.Date;

@Data
public class GoalDTO {

    private Long id;

    private String description;

    private Date startDate;

    private Date endDate;

    private Boolean achieved;
}
