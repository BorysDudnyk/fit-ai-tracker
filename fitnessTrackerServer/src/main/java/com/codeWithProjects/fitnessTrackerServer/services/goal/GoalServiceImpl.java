package com.codeWithProjects.fitnessTrackerServer.services.goal;

import com.codeWithProjects.fitnessTrackerServer.dto.GoalDTO;
import com.codeWithProjects.fitnessTrackerServer.entity.Goal;
import com.codeWithProjects.fitnessTrackerServer.repository.GoalRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GoalServiceImpl implements GoalService {

    private final GoalRepository goalRepository;

    public GoalDTO postGoal(GoalDTO dto) {
        Goal goal = new Goal();

        goal.setDescription(dto.getDescription());
        goal.setStartDate(dto.getStartDate());
        goal.setEndDate(dto.getEndDate());
        goal.setAchieved(false);

        return goalRepository.save(goal).getGoalDTO();
    }

    public List<GoalDTO> getGoals() {
        List<Goal> goals = goalRepository.findAll();

        return goals.stream().map(Goal::getGoalDTO).collect(Collectors.toList());
    }

    public GoalDTO updateStatus(Long id){
        Optional<Goal> optionalGoal = goalRepository.findById(id);

        if(optionalGoal.isPresent()){
            Goal existingGoal = optionalGoal.get();

            existingGoal.setAchieved(true);
            return goalRepository.save(existingGoal).getGoalDTO();
        }
        throw new EntityNotFoundException("Goal Not Found");
    }
}
