import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../service/user';
import { Register } from '../register/register';
import { Router } from '@angular/router';
import { Auth } from '../../service/auth';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Register,
    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {
  user = { email: '', password: '' };
  message: string = '';
  showRegister = false;

  constructor(
    private User: User,
    private router: Router,
    private auth: Auth
  ) {}

  // login.component.ts
  login() {
  this.User.login(this.user).subscribe({
    next: (res: any) => {
      this.message = res?.message || 'Вхід успішний!';

      // просто підставляємо статичне ім'я або email
      this.auth.setUsername('Борис'); // або this.user.email

      this.router.navigate(['/welcome']);
    },
    error: (err) => {
      this.message = err?.error?.message || 'Невірний логін або пароль';
    }
  });
}



  toggleRegister() {
    this.showRegister = !this.showRegister;
    this.message = '';
  }
}
