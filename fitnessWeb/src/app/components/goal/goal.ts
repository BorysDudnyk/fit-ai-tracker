import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { User } from '../../service/user';
import { DemoNgZorroAntdModule } from "../../DemoNgZorroAntdModule";
import { NgStyle } from '@angular/common';
import { SharedModule } from '../../shared/shared-module';
import { error } from 'console';

@Component({
  selector: 'app-goal',
  standalone: true,
  imports: [SharedModule,DemoNgZorroAntdModule, NgStyle, FormsModule, ReactiveFormsModule],
  templateUrl: './goal.html',
  styleUrl: './goal.scss'
})
export class Goal {

  gridStyle = {
    width: '100%',
    textAlign: 'center'
  };

  goalForm!: FormGroup;
  goals: any;

  constructor( private fb: FormBuilder, 
    private message: NzMessageService,
    private user: User
  ) {}

  ngOnInit(){
    this.goalForm = this.fb.group({
      description: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]]

    });

    this.getAllGoals();
  }

  submitForm(){
    this.user.postGoal(this.goalForm.value).subscribe(res=>{
      this.message.success("Ціль успішно додана", {nzDuration: 5000});
      this.goalForm.reset();

      this.getAllGoals();
    }, error=>{
      this.message.error("Помилка при додаванні цілі", {nzDuration: 5000});

    })
  }

  getAllGoals(){
    this.user.getGoals().subscribe(res=>{
      this.goals = res;
      console.log(this.goals);
    })
  }

  updateStatus(id:number){
    this.user.updateGoalStatus(id).subscribe(res=>{
      this.message.success("Статус цілі оновлено успішно", {nzDuration: 5000});
      this.getAllGoals();
    }, error=>{
      this.message.error("Помилка при оновленні статусу цілі", {nzDuration: 5000});
    })
  }
}
