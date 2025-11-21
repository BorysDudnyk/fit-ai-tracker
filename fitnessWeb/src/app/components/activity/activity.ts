import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared-module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { User } from '../../service/user';

@Component({
  selector: 'app-activity',
  imports: [SharedModule],
  templateUrl: './activity.html',
  styleUrl: './activity.scss'
})
export class Activity {

  gridStyle = {
    width: '100%',
    textAlign: 'center'
  };

  activityForm!: FormGroup;
  activites: any[] = [];
  filteredActivities: any[] = [];
  showAll: boolean = false; // показуємо всі записи або лише останні 7

  constructor(private fb: FormBuilder, 
              private message: NzMessageService,
              private user: User) {}

  ngOnInit(){
    this.activityForm = this.fb.group({
      caloriesBurned: [null, [Validators.required]],
      steps: [null, [Validators.required]],
      distance: [null, [Validators.required]],
      date: [null, [Validators.required]],
    });

    this.getAllActivities();
  }

  submitForm(){
    this.user.postActivity(this.activityForm.value).subscribe(res => {
      this.message.success("Активність успішно додана", { nzDuration: 5000 });
      this.activityForm.reset();
      this.getAllActivities();
    }, error => {
      this.message.error("Помилка при додаванні активності", { nzDuration: 5000 });
    })
  }

  getAllActivities(){
    this.user.getActivity().subscribe(res => {
      // сортуємо за датою від нових до старих
      this.activites = res.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      this.updateFilteredActivities();
    })
  }

  toggleShowAll() {
    this.showAll = !this.showAll;
    this.updateFilteredActivities();
  }

  updateFilteredActivities() {
    if (this.showAll) {
      this.filteredActivities = this.activites;
    } else {
      this.filteredActivities = this.activites.slice(0, 7); // останні 7 записів
    }
  }
}
