import { Injectable } from '@angular/core';

export interface HealthMetrics {
  heartRate?: number; // серцевий ритм
  sleepHours?: number; // години сну
  stressLevel?: number; // 1–10
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
}

@Injectable({ providedIn: 'root' })
export class AnomalyService {

  private possibleAnomalies: {
    check: (metrics: HealthMetrics) => boolean;
    message: string;
    advice: string;
  }[] = [
    {
      check: m => m.heartRate !== undefined && m.heartRate > 100,
      message: '⚠️ Високий пульс',
      advice: 'Перевір свій рівень навантаження та зменш темп тренувань. Зосередься на дихальних вправах.'
    },
    {
      check: m => m.sleepHours !== undefined && m.sleepHours < 6,
      message: '⚠️ Нестача сну',
      advice: 'Сон менше 6 годин може гальмувати відновлення. Намагайся лягати раніше і зменшити час перед екранами.'
    },
    {
      check: m => m.stressLevel !== undefined && m.stressLevel > 7,
      message: '⚠️ Високий рівень стресу',
      advice: 'Додай практики розслаблення: йога, дихальні техніки або коротка прогулянка перед сном.'
    },
    {
      check: m => m.activityLevel === 'sedentary',
      message: '⚠️ Малорухливий спосіб життя',
      advice: 'Навіть 10 хвилин ходьби щогодини покращують кровообіг і концентрацію.'
    },
    {
      check: m => m.activityLevel === 'veryActive',
      message: '⚠️ Перевтома від активності',
      advice: 'Організму потрібен час на відновлення. Зроби день відпочинку або легке тренування.'
    }
  ];

  constructor() {}

  getAnomalies(metrics?: HealthMetrics): { message: string; advice: string }[] {
    if (!metrics) {
      const shuffled = this.possibleAnomalies.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, Math.floor(Math.random() * 2) + 1).map(a => ({
        message: a.message,
        advice: a.advice
      }));
    }

    return this.possibleAnomalies
      .filter(a => a.check(metrics))
      .map(a => ({ message: a.message, advice: a.advice }));
  }

  /** 🔹 Повертає список лише текстових повідомлень для відображення у прогнозі */
  getAnomaliesMessages(metrics?: HealthMetrics): string[] {
    return this.getAnomalies(metrics).map(a => a.message);
  }
}
