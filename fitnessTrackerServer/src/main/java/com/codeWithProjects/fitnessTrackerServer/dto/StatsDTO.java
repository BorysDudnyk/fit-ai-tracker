package com.codeWithProjects.fitnessTrackerServer.dto;

import lombok.Data;

@Data
public class StatsDTO {

    private long achievedGoals;

    private long notAchievedGoals;

    private int steps;

    private Double distance;

    private int totalCaloriesBurned;

    private int duration;
}
