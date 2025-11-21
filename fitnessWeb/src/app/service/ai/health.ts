import { Injectable } from '@angular/core';

export interface HealthMetrics {
  pulse?: number;
  sleepHours?: number;
  stressLevel?: number;
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
  energyLevel?: number; // 1–10
}

@Injectable({ providedIn: 'root' })
export class HealthService {
  // Загальні поради
  private generalAdvices: string[] = [
    'Пийте достатньо води протягом дня.',
    'Регулярно робіть легкі розтяжки для зниження напруги.',
    'Слідкуйте за правильною поставою під час роботи та тренувань.',
    'Включайте більше фруктів та овочів у раціон.'
  ];

  /**
   * Повертає поради на основі стану користувача
   * Метрики: пульс, сон, стрес, активність, рівень енергії
   */
  getHealthAdviceByState(metrics: HealthMetrics): string[] {
    const recommendations: string[] = [];

    // 🔹 Пульс
    if (metrics.pulse !== undefined) {
      if (metrics.pulse > 100) recommendations.push('⚠️ Високий пульс: зменшіть інтенсивність тренування.');
      else if (metrics.pulse < 50) recommendations.push('Низький пульс: перевірте самопочуття перед фізичними вправами.');
    }

    // 🔹 Сон
    if (metrics.sleepHours !== undefined) {
      if (metrics.sleepHours < 6) recommendations.push('⚠️ Нестача сну: намагайтесь спати не менше 7 годин.');
      else if (metrics.sleepHours > 9) recommendations.push('Занадто багато сну може впливати на продуктивність, дотримуйтесь 7–9 годин.');
    }

    // 🔹 Стрес
    if (metrics.stressLevel !== undefined) {
      if (metrics.stressLevel > 7) recommendations.push('⚠️ Високий рівень стресу: спробуйте медитацію, дихальні вправи або прогулянку.');
      else if (metrics.stressLevel < 3) recommendations.push('Рівень стресу низький: підтримуйте баланс активності та відпочинку.');
    }

    // 🔹 Активність
    if (metrics.activityLevel !== undefined) {
      if (metrics.activityLevel === 'sedentary') recommendations.push('⚠️ Малорухливий спосіб життя: додайте короткі прогулянки або легкі вправи.');
      else if (metrics.activityLevel === 'veryActive') recommendations.push('Перевтома від активності: не забувайте про відновлення та сон.');
    }

    // 🔹 Рівень енергії
    if (metrics.energyLevel !== undefined) {
      if (metrics.energyLevel < 4) recommendations.push('Низький рівень енергії: переконайтесь, що харчування та сон достатні.');
      else if (metrics.energyLevel > 8) recommendations.push('Високий рівень енергії: можна планувати інтенсивні тренування, але слідкуйте за відновленням.');
    }

    // 🔹 Додаємо одну загальну пораду
    recommendations.push(this.getRandomItem(this.generalAdvices));

    return recommendations;
  }

  /** Випадкова загальна порада */
  private getRandomItem(array: string[]): string {
    return array[Math.floor(Math.random() * array.length)];
  }
}
