// src/app/service/ai/form.ts
import { Injectable } from '@angular/core';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';

export interface AiCoachFormData {
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female';
  activityLevel: ActivityLevel;
  goal: 'lose' | 'maintain' | 'gain';
  vegetarian: boolean;
  allergies: string[];
  preferredWorkouts: string[];
  tastePreferences: string[];
  sleepHours: number;
  stressLevel: number;
  energyLevel: number;
  flexibilityScore: number;
  recoveryTime: number;
  injuries: string[] | string;
  bodyFatGoal?: number;
  currentBodyFat?: number;
  workoutTime?: 'morning' | 'day' | 'evening';
}

@Injectable({ providedIn: 'root' })
export class AiCoachFormService {
  private formData: AiCoachFormData = {
    age: 30,
    weight: 70,
    height: 170,
    gender: 'male',
    activityLevel: 'moderate',
    goal: 'maintain',
    vegetarian: false,
    allergies: [],
    preferredWorkouts: [],
    tastePreferences: [],
    sleepHours: 7,
    stressLevel: 5,
    energyLevel: 5,
    flexibilityScore: 50,
    recoveryTime: 8,
    injuries: [],
    bodyFatGoal: 15,
    currentBodyFat: 20,
    workoutTime: 'morning'
  };

  getFormData(): AiCoachFormData {
    return { ...this.formData };
  }

  updateFormData(data: AiCoachFormData) {
    this.formData = { ...data };
  }
}
