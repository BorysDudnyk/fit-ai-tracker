import { Injectable } from '@angular/core';

export interface MotivationState {
  goal: 'lose' | 'gain' | 'maintain';
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
  injuries?: string[];
  flexibilityScore?: number; // 0–100
  recoveryTime?: number; // години
  tastePreferences?: string[];
  preferredWorkouts?: string[];
  energyLevel?: number; // 1–10
}

@Injectable({ providedIn: 'root' })
export class MotivationService {
  private quotes: Record<string, string[]> = {
    lose: [
      '🏃‍♂️ Кожен крок важливий!',
      '💧 Пий воду і будь активним!',
      '🔥 З кожним тренуванням ти ближче до мети!'
    ],
    gain: [
      '💪 Твої м’язи ростуть!',
      '🏋️‍♂️ Сила приходить з наполегливістю!',
      '🥗 Їжа – твій союзник у прогресі!'
    ],
    maintain: [
      '🌟 Продовжуй рухатись вперед!',
      '⚡ Баланс – ключ до здоров’я!',
      '😊 Збережи енергію та гарний настрій!'
    ]
  };

  getMotivation(state: MotivationState): string {
    let messages: string[] = [...(this.quotes[state.goal] || this.quotes['maintain'])];

    // 🔹 Активність
    switch(state.activityLevel) {
      case 'sedentary':
        messages.push('🚶‍♂️ Зроби хоча б невеликий рух сьогодні!');
        break;
      case 'veryActive':
        messages.push('🔥 Ти вже супер активний, тримай темп!');
        break;
    }

    // 🔹 Травми
    if (state.injuries?.length) {
      messages.push('⚠️ Тренуйся обережно через травми: ' + state.injuries.join(', '));
    }

    // 🔹 Гнучкість та відновлення
    if (state.flexibilityScore !== undefined && state.flexibilityScore < 40) {
      messages.push('🤸‍♂️ Додай розтяжку для кращої гнучкості.');
    }
    if (state.recoveryTime !== undefined && state.recoveryTime < 6) {
      messages.push('💤 Дай тілу більше часу на відновлення після тренувань.');
    }

    // 🔹 Рівень енергії
    if (state.energyLevel !== undefined) {
      if (state.energyLevel <= 3) messages.push('⚡ Почни з легкої активності, щоб зарядитись енергією.');
      else if (state.energyLevel >= 8) messages.push('💥 Використай енергію на інтенсивне тренування!');
    }

    // 🔹 Улюблені вправи та харчові вподобання
    if (state.preferredWorkouts?.length) {
      messages.push(`🏋️‍♂️ Спробуй сьогодні свої улюблені вправи: ${state.preferredWorkouts.join(', ')}`);
    }
    if (state.tastePreferences?.length) {
      messages.push(`🥗 Обирай їжу відповідно до смакових вподобань: ${state.tastePreferences.join(', ')}`);
    }

    // Випадковий вибір одного повідомлення із зібраних
    return messages[Math.floor(Math.random() * messages.length)];
  }
}
