package com.codeWithProjects.fitnessTrackerServer.repository;

import com.codeWithProjects.fitnessTrackerServer.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;
import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {

    @Query("SELECT SUM(a.steps) FROM Activity a")
    Integer getTotalSteps();

    @Query("SELECT SUM(a.distance) FROM Activity a")
    Double getTotalDistance();

    @Query("SELECT SUM(a.caloriesBurned) FROM Activity a")
    Integer getTotalActivityCalories();

    @Query("SELECT a FROM Activity a ORDER BY a.date DESC")
    List<Activity> findLast7Activities(Pageable pageable);
}
