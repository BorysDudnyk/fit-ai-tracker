import { Injectable } from '@angular/core';
import { AnomalyService, HealthMetrics } from './anomaly';

@Injectable({ providedIn: 'root' })
export class ForecastService {
  constructor(private anomalyService: AnomalyService) {}

  getForecast(
    intensity: 'low' | 'medium' | 'high',
    steps: number,
    water: number,
    metrics?: HealthMetrics
  ): string {
    // Використовуємо передані метрики для аномалій, якщо вони є
    const anomalies = this.anomalyService.getAnomalies(metrics);
    let forecast = '';

    // 🔹 Прогноз по інтенсивності
    if (intensity === 'low') forecast += 'Сьогодні краще легке тренування';
    else if (intensity === 'medium') forecast += 'Оптимальна середня активність';
    else forecast += 'Сьогодні можна інтенсивно тренуватись';

    // 🔹 Прогноз по воді
    if (water < 2) forecast += ' та більше пийте води';
    else if (water > 4) forecast += ', але не забувайте про відпочинок';

    // 🔹 Прогноз по кроках
    if (steps < 5000) forecast += ', спробуйте пройти трохи більше кроків';
    else if (steps > 12000) forecast += ', ви дуже активні сьогодні';

    // 🔹 Прогноз по аномаліях
    if (anomalies.length > 0) {
      const anomaliesText = anomalies.map(a => `${a.message}: ${a.advice}`).join('; ');
      forecast += `. Також врахуйте аномалії: ${anomaliesText}`;
    }

    forecast += '.';
    return forecast;
  }
}
