import { Injectable } from '@angular/core';

export interface WorkoutPreferences {
  goal: 'lose' | 'gain' | 'maintain';
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
  favoriteExercises?: string[]; // наприклад ['Йога', 'Біг']
  energyLevel?: number; // 1-10
  injuries?: string[]; // наприклад ['knee', 'shoulder']
  currentFat?: number; // %
  targetFat?: number; // %
  flexibility?: number; // 0-100
}

@Injectable({ providedIn: 'root' })
export class PlanService {
  private workoutsByGoal: Record<string, { type: string; description: string }[]> = {
    lose: [
      { type: 'Кардіо', description: '🏃‍♂️ Біг 30 хв' },
      { type: 'Силові', description: '🏋️‍♀️ Силові 2 дні/тиждень' },
      { type: 'Йога', description: '🧘‍♂️ Йога 10 хв' },
      { type: 'Кардіо', description: '🚴‍♂️ Велотренажер 20 хв' },
      { type: 'Бокс', description: '🥊 Бокс 15 хв' }
    ],
    gain: [
      { type: 'Силові', description: '🏋️‍♂️ Силові 4 дні/тиждень' },
      { type: 'Кардіо', description: '🏃‍♂️ Кардіо 1-2 дні' },
      { type: 'Розтяжка', description: '🧘‍♂️ Розтяжка 10 хв' },
      { type: 'Плавання', description: '🏊‍♂️ Плавання 30 хв' },
      { type: 'Силові', description: '🏋️‍♀️ Гантелі 20 хв' }
    ],
    maintain: [
      { type: 'Кардіо', description: '🏃‍♂️ Біг 20 хв' },
      { type: 'Силові', description: '🏋️‍♂️ Силові 3 дні/тиждень' },
      { type: 'Йога', description: '🧘‍♂️ Йога 10 хв' },
      { type: 'Кардіо', description: '🚴‍♂️ Велотренажер 20 хв' },
      { type: 'Розтяжка', description: '🥋 Легка розтяжка 15 хв' }
    ]
  };

  constructor() {}

  getWorkout(preferences: WorkoutPreferences): string[] {
    let { goal, activityLevel, favoriteExercises, energyLevel, injuries, currentFat, targetFat, flexibility } = preferences;
    let exercises = [...(this.workoutsByGoal[goal] || [])];

    // Фільтруємо по травмах: прибираємо вправи, що можуть бути небезпечні
    if (injuries?.length) {
      exercises = exercises.filter(e => {
        if (injuries.includes('knee') && ['Біг', 'Силові', 'Бокс'].some(t => e.type.includes(t))) return false;
        if (injuries.includes('shoulder') && ['Силові', 'Бокс'].some(t => e.type.includes(t))) return false;
        return true;
      });
    }

    // Фільтруємо по улюблених типах
    if (favoriteExercises?.length) {
      const favored = exercises.filter(e => favoriteExercises.includes(e.type));
      exercises = favored.length ? favored : exercises;
    }

    // Корекція за енергією: якщо низька, прибираємо інтенсивні вправи
    if (energyLevel && energyLevel <= 4) {
      exercises = exercises.filter(e => !['Силові', 'Бокс', 'Кардіо'].includes(e.type));
      if (exercises.length === 0) exercises = [{ type: 'Легка активність', description: '🧘‍♂️ Легка розтяжка 10 хв' }];
    }

    // Корекція по гнучкості: якщо низька, більше розтяжки/йоги
    if (flexibility !== undefined && flexibility < 50) {
      const stretching = exercises.filter(e => ['Йога', 'Розтяжка'].includes(e.type));
      if (stretching.length > 0) exercises = stretching;
    }

    // Корекція по відсотку жиру: якщо ціль зменшити жир, додаємо кардіо, прибираємо силові
    if (currentFat !== undefined && targetFat !== undefined && goal === 'lose' && currentFat > targetFat) {
      exercises = exercises.filter(e => e.type !== 'Силові');
      if (!exercises.some(e => e.type === 'Кардіо')) exercises.push({ type: 'Кардіо', description: '🏃‍♂️ Біг 20 хв' });
    }

    // Корекція кількості вправ за рівнем активності
    let count = 3;
    if (activityLevel === 'sedentary') count = 2;
    else if (activityLevel === 'light') count = 3;
    else if (activityLevel === 'moderate') count = 4;
    else if (activityLevel === 'active' || activityLevel === 'veryActive') count = 5;

    // Повертаємо перші count елементів (без рандому)
    return exercises.slice(0, count).map(e => e.description);
  }
}
