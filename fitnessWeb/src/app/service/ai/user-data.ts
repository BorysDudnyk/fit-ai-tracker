// src/app/service/ai/user-data.ts
import { Injectable } from '@angular/core';

export interface UserProgress {
  input: number[]; // [sleep/10, stress/10, activity]
  result: number;  // 0.0 – 1.0 (оцінка користувача)
  timestamp: number;
}

@Injectable({ providedIn: 'root' })
export class UserDataService {
  private readonly KEY = 'ai-coach-user-data';
  private data: UserProgress[] = [];

  constructor() {
    this.load();
  }

  /** Додає новий результат користувача */
  add(input: number[], result: number) {
    this.data.push({ input, result, timestamp: Date.now() });
    if (this.data.length > 200) this.data.shift(); // ліміт
    this.save();
  }

  /** Повертає всі дані */
  getAll(): UserProgress[] {
    return this.data;
  }

  /** Очищає історію */
  clear() {
    this.data = [];
    localStorage.removeItem(this.KEY);
  }

  private save() {
    localStorage.setItem(this.KEY, JSON.stringify(this.data));
  }

  private load() {
    const raw = localStorage.getItem(this.KEY);
    if (raw) {
      try {
        this.data = JSON.parse(raw);
      } catch {
        this.data = [];
      }
    }
  }
}