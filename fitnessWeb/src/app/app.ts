import { Component, signal, effect } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SharedModule } from './shared/shared-module';
import { FormsModule } from '@angular/forms';
import { Auth } from './service/auth';
import { StatsService } from './service/notifications/stats';
import { NotificationService } from './service/notifications/notification';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SharedModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  protected readonly title = signal('fitnessWeb');

  constructor(
    public auth: Auth,
    private router: Router,
    private statsService: StatsService,
    private notification: NotificationService
  ) {
    // Редирект на логін
    effect(() => {
      const name = this.auth.username();
      if (name === 'Гість') {
        this.router.navigate(['/login']);
      }
    });

    // Перевірка тренувань сьогодні
    this.statsService.getTodayWorkouts().subscribe(workouts => {
      if (!workouts || workouts.length === 0) {
        this.notification.sendNotification(
          'Нагадування про тренування',
          'Сьогодні у вас ще немає запланованих тренувань!'
        );
      }
    });
  }
}
