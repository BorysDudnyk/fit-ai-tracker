import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared-module';
import { User } from '../../service/user';

interface Achievement {
  title: string;
  value: number;
  goal: number;
  progress: number;
  isGoalStat?: boolean;
}

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './achievements.html',
  styleUrls: ['./achievements.scss']
})
export class Achievements implements OnInit {
  achievements: Achievement[] = [];

  private milestones = {
    calories: [1000, 5000, 10000, 20000, 35000, 50000],
    steps: [10000, 30000, 50000, 70000, 100000, 150000],
    distance: [5, 10, 25, 50, 75, 100],
    goals: [1, 2, 3, 5, 7, 10]
  };

  constructor(private user: User) {}

  ngOnInit() {
    this.loadAchievements();
  }

  loadAchievements() {
    this.user.getStats().subscribe(res => {
      const totalCalories = Number(res?.totalCaloriesBurned ?? res?.totalCalories ?? 0) || 0;
      const totalDistance = Number(res?.distance ?? res?.totalDistance ?? 0) || 0;
      const totalSteps = Number(res?.steps ?? res?.totalSteps ?? 0) || 0;

      const achieved = Number(res?.achievedGoals ?? res?.achieved ?? 0) || 0;
      const notAchieved = Number(res?.notAchievedGoals ?? res?.notAchieved ?? res?.failedGoals ?? 0) || 0;
      const totalGoals = achieved + notAchieved;

      this.achievements = [
        ...this.createMilestones('🔥 Спалено калорій', totalCalories, this.milestones.calories),
        ...this.createMilestones('🚶 Кроків зроблено', totalSteps, this.milestones.steps),
        ...this.createMilestones('📏 Дистанція (км)', totalDistance, this.milestones.distance),
        ...this.createMilestones('✅ Досягнуті цілі', achieved, this.milestones.goals, true)
      ];

      this.achievements.push({
        title: '❌ Невиконані цілі',
        value: notAchieved,
        goal: totalGoals,
        progress: this.calcProgress(notAchieved, totalGoals),
        isGoalStat: true
      });

    }, err => {
      console.error('Failed to load stats for achievements', err);
      this.achievements = [];
    });
  }

  private createMilestones(title: string, value: number, goals: number[], isGoalStat: boolean = false): Achievement[] {
    return goals.map(goal => ({
      title,
      value: Math.min(value, goal),
      goal,
      progress: this.calcProgress(Math.min(value, goal), goal),
      isGoalStat
    }));
  }

  private calcProgress(value: number, goal: number): number {
    if (!goal || goal <= 0) return 0;
    const pct = Math.round((value / goal) * 100);
    return Math.max(0, Math.min(100, pct));
  }
}
