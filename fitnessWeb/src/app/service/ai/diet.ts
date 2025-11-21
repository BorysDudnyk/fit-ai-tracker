import { Injectable } from '@angular/core';

export interface DietPreferences {
  vegetarian?: boolean;
  allergies?: string[];
  tastePreferences?: string[]; // 'sweet', 'salty', 'spicy', ...
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
  energyLevel?: number; // 1-10
}

@Injectable({ providedIn: 'root' })
export class DietService {
  private mealsByGoal: any = {
    lose: {
      breakfast: ['🥣 Овсянка з ягодами', '🍳 Омлет з овочами', '🍌 Банан з йогуртом', '🍵 Зелене смузі', '🥪 Цільнозерновий тост з авокадо'],
      lunch: ['🍗 Курка з овочами', '🥗 Салат з тунцем', '🥩 Стейк з броколі', '🍲 Легкий суп з куркою', '🥙 Лаваш з індичкою'],
      dinner: ['🥗 Салат з тунцем', '🐟 Запечена риба з овочами', '🥬 Овочеве рагу', '🥚 Омлет зі шпинатом', '🍲 Легкий суп з морепродуктами'],
      snack: ['🍏 Яблуко з горіхами', '🥜 Горіхи', '🍓 Йогурт з ягодами', '🥕 Морквяні палички', '🍌 Банан']
    },
    gain: {
      breakfast: ['🍳 Омлет з овочами і сиром', '🥪 Тост з арахісовим маслом', '🥣 Вівсянка з бананом', '🍌 Бананово-протеїновий смузі', '🥞 Млинці з сиром'],
      lunch: ['🥩 Стейк з рисом', '🍗 Курка з кіноа', '🐟 Риба з овочами', '🥙 Лаваш з індичкою', '🍲 Суп із курки з нутом'],
      dinner: ['🍗 Курка з овочами', '🥩 Стейк з запеченою картоплею', '🐟 Риба з салатом', '🥘 Тушковані овочі з м’ясом', '🥙 Лаваш з тунцем'],
      snack: ['🥤 Протеїновий коктейль', '🍌 Банан', '🥜 Горіхи', '🍫 Темний шоколад', '🍓 Йогурт']
    },
    maintain: {
      breakfast: ['🥣 Вівсянка з фруктами', '🍳 Омлет з овочами', '🍌 Банан', '🍵 Чай', '🥪 Тост з авокадо'],
      lunch: ['🍗 Курка з овочами', '🥗 Салат з тунцем', '🍲 Суп з овочами', '🥙 Лаваш з індичкою', '🐟 Риба з салатом'],
      dinner: ['🥗 Салат з овочами', '🐟 Риба з овочами', '🥬 Овочеве рагу', '🍲 Легкий суп', '🥚 Омлет'],
      snack: ['🍏 Яблуко', '🥜 Горіхи', '🍓 Йогурт', '🥕 Морквяні палички', '🍌 Банан']
    }
  };

  constructor() {}

  getMeals(goal: string, preferences?: DietPreferences) {
    const meals = this.mealsByGoal[goal];
    return {
      breakfast: this.getRandomMeal(meals.breakfast, preferences),
      lunch: this.getRandomMeal(meals.lunch, preferences),
      dinner: this.getRandomMeal(meals.dinner, preferences),
      snack: this.getRandomMeal(meals.snack, preferences)
    };
  }

  private getRandomMeal(array: string[], preferences?: DietPreferences): string {
    let filtered = array;

    // Вегетаріанство
    if (preferences?.vegetarian) {
      filtered = filtered.filter(m => !['🐟', '🥩', '🍗'].some(meat => m.includes(meat)));
    }

    // Алергії
    if (preferences?.allergies?.length) {
      filtered = filtered.filter(m => !preferences.allergies.some(a => {
        if (a === 'nuts') return m.includes('🥜');
        if (a === 'fish') return m.includes('🐟');
        if (a === 'egg') return m.includes('🍳') || m.includes('🥚');
        return false;
      }));
    }

    // Харчові вподобання
    if (preferences?.tastePreferences?.length) {
      filtered = filtered.filter(m => preferences.tastePreferences!.some(tp => {
        if (tp === 'sweet') return m.includes('🍌') || m.includes('🍫') || m.includes('🥞');
        if (tp === 'salty') return m.includes('🥙') || m.includes('🥪') || m.includes('🥩');
        if (tp === 'spicy') return m.includes('🌶') || m.includes('🥘');
        return false;
      }));
    }

    // Рівень енергії → легші варіанти при низькій енергії
    if (preferences?.energyLevel && preferences.energyLevel <= 4) {
      filtered = filtered.filter(m => !['🥩', '🥪', '🍫'].some(heavy => m.includes(heavy)));
    }

    // Активність → підбір калорійних/білкових страв
    if (preferences?.activityLevel) {
      if (['sedentary', 'light'].includes(preferences.activityLevel)) {
        filtered = filtered.filter(m => !['🥩', '🍗', '🐟'].some(high => m.includes(high)));
      } else if (['active', 'veryActive'].includes(preferences.activityLevel)) {
        filtered = filtered.concat(array); // додаємо більше білкових опцій
      }
    }

    if (filtered.length === 0) return '🥗 Легкий салат';
    return filtered[Math.floor(Math.random() * filtered.length)];
  }
}
