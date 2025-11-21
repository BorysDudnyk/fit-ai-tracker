import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared-module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { User } from '../../service/user';

@Component({
  selector: 'app-workout',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './workout.html',
  styleUrls: ['./workout.scss']
})
export class Workout {

  gridStyle = {
    width: '100%',
    textAlign: 'center'
  };

  workoutForm!: FormGroup;

  listOfType: any[] = [
    "Кардіо", "Силові", "Пілатес", "Танці", "Велоспорт", "Біг", "Плавання",
    "Ходьба", "Бокс", "Кросфіт", "Гребля", "Гімнастика", "Скелелазіння",
    "Йога", "Пауерліфтинг", "Важка атлетика", "Похід", "Сноубординг",
    "Катання на ковзанах", "Серфінг", "Каякінг", "Паркур", "Аеробіка"
  ];

  workouts: any[] = [];
  filteredWorkouts: any[] = [];
  showAll = false;

  constructor(
    private fb: FormBuilder,
    private user: User,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.workoutForm = this.fb.group({
      type: [null, [Validators.required]],
      duration: [null, [Validators.required]],
      date: [null, [Validators.required]],
      caloriesBurned: [null, [Validators.required]]
    });

    this.getWorkouts();
  }

  getWorkouts() {
    this.user.getWorkouts().subscribe(res => {
      this.workouts = res.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      this.updateFilteredWorkouts();
    });
  }

  updateFilteredWorkouts() {
    if (this.showAll) {
      this.filteredWorkouts = this.workouts;
    } else {
      this.filteredWorkouts = this.workouts.slice(0, 7);
    }
  }


  toggleShowAll() {
    this.showAll = !this.showAll;
    this.updateFilteredWorkouts();
  }

  submitForm() {
    this.user.postWorkout(this.workoutForm.value).subscribe(res => {
      this.message.success("Тренування успішно додано", { nzDuration: 5000 });
      this.workoutForm.reset();
      this.getWorkouts();
    }, error => {
      this.message.error("Помилка при додаванні тренування", { nzDuration: 5000 });
    });
  }
}
