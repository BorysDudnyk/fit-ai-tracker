import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  constructor() {}

  // Повертає статистику тренувань за сьогодні
  getTodayWorkouts() {
    // Тут можна зробити HTTP-запит до БД, поки просто мок
    return of([]); // порожній масив = сьогодні немає тренувань
  }
}
