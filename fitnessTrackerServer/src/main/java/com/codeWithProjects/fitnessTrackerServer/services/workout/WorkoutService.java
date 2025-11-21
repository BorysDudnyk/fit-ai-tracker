package com.codeWithProjects.fitnessTrackerServer.services.workout;

import com.codeWithProjects.fitnessTrackerServer.dto.WorkoutDTO;

import java.util.List;

public interface WorkoutService {

    WorkoutDTO postWorkout(WorkoutDTO workoutDTO);

    List<WorkoutDTO> getWorkouts();
}
