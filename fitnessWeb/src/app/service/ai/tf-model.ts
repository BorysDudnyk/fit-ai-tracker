// src/app/service/ai/tf-model.ts
import * as tf from '@tensorflow/tfjs';
import { Injectable } from '@angular/core';
import { UserDataService } from './user-data';

const MODEL_STORAGE_KEY = 'fitness-ai-model-v1';
const MODEL_URL = `localstorage://${MODEL_STORAGE_KEY}`;

@Injectable({ providedIn: 'root' })
export class TfModelService {
  private model?: tf.Sequential;
  private isModelReady = false;

  constructor(private userData: UserDataService) {
    this.loadOrCreateModel();
  }

  /** Завантажує модель або створює нову */
  private async loadOrCreateModel() {
    try {
      const model = await tf.loadLayersModel(MODEL_URL);
      this.model = model as tf.Sequential;
      console.log('Модель завантажена з localStorage');
      this.isModelReady = true;
    } catch (error) {
      console.log('Модель не знайдена — створюємо та тренуємо...');
      await this.createAndTrainModel();
    }
  }

  /** Створює і тренує базову модель */
  private async createAndTrainModel() {
    this.model = tf.sequential();

    this.model.add(tf.layers.dense({ inputShape: [3], units: 16, activation: 'relu' }));
    this.model.add(tf.layers.dense({ units: 8, activation: 'relu' }));
    this.model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

    this.model.compile({
      optimizer: tf.train.adam(0.01),
      loss: 'meanSquaredError'
    });

    // Синтетичні дані
    const data: number[][] = [];
    const labels: number[] = [];

    for (let i = 0; i < 300; i++) {
      const sleep = Math.random() * 0.6 + 0.4; // 0.4–1.0 → 4–10 год
      const stress = Math.random();            // 0–1
      const activity = Math.random();          // 0–1

      const progress = sleep > 0.7 && stress < 0.5 && activity > 0.4
        ? 0.8 + Math.random() * 0.2
        : stress > 0.7
          ? 0.1 + Math.random() * 0.2
          : 0.4 + Math.random() * 0.3;

      data.push([sleep, stress, activity]);
      labels.push(progress);
    }

    const xs = tf.tensor2d(data);
    const ys = tf.tensor2d(labels, [labels.length, 1]);

    await this.model.fit(xs, ys, {
      epochs: 120,
      batchSize: 16,
      shuffle: true,
      verbose: 0
    });

    xs.dispose();
    ys.dispose();

    // Зберігаємо
    try {
      await this.model.save(MODEL_URL);
      console.log('Базова модель збережена');
    } catch (saveError) {
      console.warn('Не вдалося зберегти модель:', saveError);
    }

    this.isModelReady = true;
  }

  /** Очікує готовності моделі */
  private async waitForModel(): Promise<void> {
    while (!this.isModelReady) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }

  /** Прогноз */
  async predict(input: number[]): Promise<number> {
    await this.waitForModel();

    if (!this.model) throw new Error('Модель не ініціалізована');

    const tensor = tf.tensor2d([input]);
    let result: number;

    try {
      const prediction = await this.model.predict(tensor) as tf.Tensor;
      result = (await prediction.data())[0];
      prediction.dispose();
    } catch (error) {
      console.error('Помилка прогнозу:', error);
      throw error;
    } finally {
      tensor.dispose();
    }

    return result;
  }

  /** Донавчання на реальних даних користувача */
  async fineTune() {
    const data = this.userData.getAll();
    if (data.length < 5) {
      console.log(`Замало даних для донавчання (${data.length})`);
      return;
    }

    const xs = tf.tensor2d(data.map(d => d.input));
    const ys = tf.tensor2d(data.map(d => [d.result]));

    console.log(`Донавчання на ${data.length} реальних прикладах...`);

    await this.model!.fit(xs, ys, {
      epochs: 30,
      batchSize: Math.min(8, data.length),
      verbose: 0
    });

    xs.dispose();
    ys.dispose();

    try {
      await this.model!.save(MODEL_URL);
      console.log('Модель донавчена та збережена');
    } catch (error) {
      console.warn('Не вдалося зберегти донавчену модель:', error);
    }
  }

  /** Повне перетренування (видаляє все) */
  async retrain() {
    if (this.model) {
      this.model.dispose();
      this.model = undefined;
    }

    try {
      await tf.io.removeModel(MODEL_URL);
      console.log('Стара модель видалена');
    } catch (error) {
      console.warn('Помилка видалення моделі:', error);
    }

    localStorage.removeItem(MODEL_STORAGE_KEY);
    this.isModelReady = false;

    await this.loadOrCreateModel();
  }
}