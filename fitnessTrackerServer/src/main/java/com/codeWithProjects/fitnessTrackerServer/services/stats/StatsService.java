package com.codeWithProjects.fitnessTrackerServer.services.stats;

import com.codeWithProjects.fitnessTrackerServer.dto.GraphDTO;
import com.codeWithProjects.fitnessTrackerServer.dto.StatsDTO;

public interface StatsService {

    StatsDTO getStats();

    GraphDTO getGraphStats();
}
