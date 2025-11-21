package com.codeWithProjects.fitnessTrackerServer.services.goal;

import com.codeWithProjects.fitnessTrackerServer.dto.GoalDTO;

import java.util.List;

public interface GoalService {

    GoalDTO postGoal(GoalDTO dto);

    List<GoalDTO> getGoals();

    GoalDTO updateStatus(Long id);
}
