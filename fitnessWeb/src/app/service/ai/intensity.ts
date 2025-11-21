import { Injectable } from '@angular/core';

export interface IntensityState {
  pulse?: number;
  sleepHours?: number;
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
  energyLevel?: number; // 1–10
}

@Injectable({ providedIn: 'root' })
export class IntensityService {
  /**
   * Оцінка інтенсивності на основі цілі та стану користувача
   * @param goal 'lose' | 'gain' | 'maintain'
   * @param state Метрики користувача
   */
  getIntensity(goal: string, state?: IntensityState): string {
    let intensity = 'Помірна інтенсивність';

    // 🔹 Базова оцінка по цілі
    switch(goal) {
      case 'lose': intensity = 'Середня інтенсивність'; break;
      case 'gain': intensity = 'Висока інтенсивність'; break;
      case 'maintain': intensity = 'Помірна інтенсивність'; break;
    }

    if (!state) return intensity;

    // 🔹 Корекція по стану користувача
    if (state.pulse !== undefined && state.pulse > 100) {
      intensity = 'Легка інтенсивність';
    } else if (state.sleepHours !== undefined && state.sleepHours < 6) {
      intensity = 'Легка інтенсивність';
    } else if (state.activityLevel) {
      switch(state.activityLevel) {
        case 'sedentary': intensity = 'Легка інтенсивність'; break;
        case 'light': intensity = 'Середня інтенсивність'; break;
        case 'moderate': intensity = 'Середня інтенсивність'; break;
        case 'active': intensity = 'Висока інтенсивність'; break;
        case 'veryActive': intensity = 'Висока інтенсивність'; break;
      }
    }

    // 🔹 Корекція по рівню енергії
    if (state.energyLevel !== undefined) {
      if (state.energyLevel < 4) intensity = 'Легка інтенсивність';
      else if (state.energyLevel > 8) intensity = 'Висока інтенсивність';
    }

    return intensity;
  }
}
