// src/app/components/ai-coach/ai-coach.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzModalService, NzModalRef } from 'ng-zorro-antd/modal';

// Сервіси
import { AiCoachFormService, AiCoachFormData, ActivityLevel } from '../../service/ai/form';
import { PlanService } from '../../service/ai/plan';
import { DietService } from '../../service/ai/diet';
import { MotivationService } from '../../service/ai/motivation';
import { IntensityService } from '../../service/ai/intensity';
import { HealthService } from '../../service/ai/health';
import { AnomalyService, HealthMetrics } from '../../service/ai/anomaly';
import { ForecastService } from '../../service/ai/forecast';
import { TfModelService } from '../../service/ai/tf-model';
import { UserDataService } from '../../service/ai/user-data';
import { AiCoachModalService } from '../../service/ai/ai-coach-modal.service';

// Компонент
import { AdviceFeedbackComponent } from '../advice-feedback/advice-feedback.component';

interface Metrics extends HealthMetrics {
  activityLevel: ActivityLevel;
}

@Component({
  selector: 'app-ai-coach',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzCardModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    AdviceFeedbackComponent  // Тепер використовується в шаблоні!
  ],
  templateUrl: './ai-coach.html',
  styleUrls: ['./ai-coach.scss'],
  providers: [
    NzModalService,
    PlanService,
    DietService,
    MotivationService,
    IntensityService,
    HealthService,
    AnomalyService,
    ForecastService,
    TfModelService,
    UserDataService,
    AiCoachModalService
  ]
})
export class AiCoach implements OnInit {
  @ViewChild('feedback') feedbackComponent!: AdviceFeedbackComponent; // Додано

  formData!: AiCoachFormData;
  isLoading = false;
  retraining = false;

  sleepHoursList = Array.from({ length: 13 }, (_, i) => i + 3);
  stressLevels = Array.from({ length: 10 }, (_, i) => i + 1);
  energyLevels = Array.from({ length: 10 }, (_, i) => i + 1);

  listOfType: string[] = [
    "Кардіо", "Силові", "Пілатес", "Танці", "Велоспорт", "Біг", "Плавання",
    "Ходьба", "Бокс", "Кросфіт", "Гребля", "Гімнастика", "Скелелазіння",
    "Йога", "Пауерліфтинг", "Важка атлетика", "Похід", "Сноубординг",
    "Катання на ковзанах", "Серфінг", "Каякінг", "Паркур", "Аеробіка"
  ];

  private readonly multiplier: Record<ActivityLevel, number> = {
    sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9
  };

  constructor(
    private modal: NzModalService,
    public modalService: AiCoachModalService,
    private formService: AiCoachFormService,
    private planService: PlanService,
    private dietService: DietService,
    private motivationService: MotivationService,
    private intensityService: IntensityService,
    private healthService: HealthService,
    private anomalyService: AnomalyService,
    private forecastService: ForecastService,
    private tfModel: TfModelService,
    public userData: UserDataService
  ) {}

  ngOnInit() {
    this.formData = this.formService.getFormData();
  }

  async getAdvice() {
    this.isLoading = true;
    this.formService.updateFormData(this.formData);

    try {
      const { age, weight, height, gender, activityLevel, goal } = this.formData;

      const bmr = gender === 'male'
        ? 88.36 + 13.4 * (weight || 70) + 4.8 * (height || 170) - 5.7 * (age || 30)
        : 447.6 + 9.2 * (weight || 60) + 3.1 * (height || 160) - 4.3 * (age || 30);

      const totalBmr = bmr * this.multiplier[activityLevel];
      const calories = goal === 'lose' ? totalBmr - 500 : goal === 'gain' ? totalBmr + 400 : totalBmr;
      const protein = Math.round((weight || 70) * 1.8);
      const fats = Math.round((weight || 70) * 0.8);
      const carbs = Math.round((calories - (protein * 4 + fats * 9)) / 4);
      const water = Math.round((weight || 70) * 0.035 * 10) / 10;

      const metrics: Metrics = {
        sleepHours: this.formData.sleepHours || 7,
        stressLevel: this.formData.stressLevel || 5,
        activityLevel: this.formData.activityLevel
      };

      const anomalies = this.anomalyService.getAnomalies(metrics);
      const anomaliesText = anomalies.length ? anomalies.map(a => `${a.message}: ${a.advice}`).join('<br>• ') : '';

      const intensity = this.intensityService.getIntensity(goal, metrics);
      const meals = this.dietService.getMeals(goal, { ...this.formData });
      const workoutPlan = this.planService.getWorkout({
        goal,
        activityLevel: this.formData.activityLevel,
        favoriteExercises: this.formData.preferredWorkouts || [],
        energyLevel: this.formData.energyLevel
      });
      const health = this.healthService.getHealthAdviceByState(metrics);

      const injuries = Array.isArray(this.formData.injuries)
        ? this.formData.injuries
        : (this.formData.injuries || '').split(',').map(i => i.trim()).filter(Boolean);

      const motivation = this.motivationService.getMotivation({
        goal,
        activityLevel: this.formData.activityLevel,
        injuries,
        flexibilityScore: this.formData.flexibilityScore,
        recoveryTime: this.formData.recoveryTime,
        tastePreferences: this.formData.tastePreferences,
        preferredWorkouts: this.formData.preferredWorkouts,
        energyLevel: this.formData.energyLevel
      });

      const forecast = this.forecastService.getForecast(
        typeof intensity === 'string' ? (intensity.includes('Висока') ? 'high' : intensity.includes('Легка') ? 'low' : 'medium') : 'medium',
        0, water, metrics
      );

      let aiResult = 'AI прогноз недоступний';
      let aiPrediction = 0;
      try {
        const normalizedActivity = (this.multiplier[metrics.activityLevel] - 1.2) / 0.7;
        aiPrediction = await this.tfModel.predict([
          (metrics.sleepHours || 7) / 10,
          (metrics.stressLevel || 5) / 10,
          normalizedActivity
        ]);

        aiResult = aiPrediction > 0.7 ? 'Висока ймовірність стабільного прогресу'
          : aiPrediction > 0.4 ? 'Гарний потенціал з невеликими ризиками'
          : 'Потрібно більше відпочинку або корекція навантажень';
      } catch (err) {
        console.warn('TensorFlow.js прогноз не вдався:', err);
      }

      const currentInput = [
        (metrics.sleepHours || 7) / 10,
        (metrics.stressLevel || 5) / 10,
        (this.multiplier[metrics.activityLevel] - 1.2) / 0.7
      ];

      // ОСНОВНА МОДАЛКА
      const mainModal = this.modal.create({
        nzTitle: 'Персональна аналітика',
        nzContent: `
          <b>Калорії:</b> ${Math.round(calories)} ккал<br>
          <b>Білки:</b> ${protein} г, <b>Жири:</b> ${fats} г, <b>Вуглеводи:</b> ${carbs} г<br>
          <b>Вода:</b> ${water} л/день<br><hr>
          <b>Інтенсивність:</b> ${intensity}<br>
          <b>Прогноз:</b> ${forecast}<br>
          ${anomaliesText ? `<b>Аномалії:</b><br>• ${anomaliesText}<hr>` : ''}
          <b>План тренувань:</b><br>• ${workoutPlan.join('<br>• ')}<br><br>
          <b>Раціон:</b><br>
          Сніданок: ${meals.breakfast}<br>
          Обід: ${meals.lunch}<br>
          Вечеря: ${meals.dinner}<br>
          Перекус: ${meals.snack}<hr>
          <b>Поради:</b><br>• ${health.join('<br>• ')}<br><br>
          <b>Мотивація:</b> ${motivation}<hr>
          <b>AI Прогноз:</b> ${aiResult}<br><br>
        `,
        nzWidth: 820,
        nzFooter: null
      });

      // МОДАЛКА ЗІ ЗІРОЧКАМИ — ПРАВИЛЬНО
      mainModal.afterOpen.subscribe(() => {
        setTimeout(() => {
          const feedbackModal = this.modal.create({
            nzTitle: 'Оцініть пораду',
            nzContent: AdviceFeedbackComponent,
            nzFooter: null,
            nzWidth: 400,
            nzCentered: true,
            nzData: { selected: 0 },
            nzOnOk: () => {
              const instance = feedbackModal.getContentComponent() as AdviceFeedbackComponent;
              if (instance.selected > 0) {
                this.saveFeedback(instance.selected, currentInput, aiPrediction);
              }
            }
          });

          feedbackModal.afterOpen.subscribe(() => {
            const instance = feedbackModal.getContentComponent() as AdviceFeedbackComponent;
            instance.rated.subscribe((stars: number) => {
              this.saveFeedback(stars, currentInput, aiPrediction);
              feedbackModal.close();
            });
          });
        }, 100);
      });

    } catch (error) {
      this.modal.error({ nzTitle: 'Помилка', nzContent: 'Не вдалося згенерувати пораду.' });
    } finally {
      this.isLoading = false;
    }
  }

  saveFeedback(stars: number, input: number[], aiPrediction: number) {
    const result = stars / 5;
    this.userData.add(input, result);

    if (this.userData.getAll().length % 10 === 0) {
      this.tfModel.fineTune();
    }
  }

  async retrainModel() {
    this.retraining = true;
    try {
      await this.tfModel.retrain();
      this.modal.success({ nzTitle: 'AI оновлено', nzContent: 'Модель перетренована!' });
    } catch (err) {
      this.modal.error({ nzTitle: 'Помилка', nzContent: 'Не вдалося оновити модель.' });
    } finally {
      this.retraining = false;
    }
  }

  onFileChange(event: any) {
    this.modalService.handleImport(event, (count) => {
      this.modal.success({ nzTitle: 'Імпорт завершено', nzContent: `Завантажено ${count} записів.` });
    });
  }

  confirmRetrain() {}
}