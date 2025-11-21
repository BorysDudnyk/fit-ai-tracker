import { Component, EventEmitter, Output } from '@angular/core';
import { User } from '../../service/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';


interface FrontUserDTO {
  firstName: string;
  lastName: string;
  nickname: string;
  password: string;
  confirmPassword: string;
  phone: string;
  birthDate: string;
  gender: string;
  country: string;
  city: string;
  role: string;
  email: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, NzCardModule, NzFormModule, NzInputModule, NzButtonModule, NzSelectModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class Register {
  @Output() backToLogin = new EventEmitter<void>();

  user: FrontUserDTO = {
    firstName: '',
    lastName: '',
    nickname: '',
    password: '',
    confirmPassword: '',
    phone: '',
    birthDate: '',
    gender: '',
    country: '',
    city: '',
    role: 'USER',
    email: ''
  };

  message: string = '';

  constructor(private userService: User) {}

  passwordsMatch(): boolean {
    return this.user.password === this.user.confirmPassword;
  }

  isFormValid(): boolean {
    return !!(
      this.user.firstName &&
      this.user.lastName &&
      this.user.nickname &&
      this.user.email &&
      this.user.password &&
      this.passwordsMatch() &&
      this.user.phone &&
      this.user.birthDate &&
      this.user.gender &&
      this.user.country &&
      this.user.city
    );
  }

  register() {
    if (!this.isFormValid()) return;

    // Створюємо payload для бекенду
    const payload = {
      username: this.user.nickname,
      password: this.user.password,
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      phoneNumber: this.user.phone,
      birthDate: this.user.birthDate,
      gender: this.user.gender,
      countryCity: `${this.user.country}, ${this.user.city}`,
      profilePhoto: null,
      role: this.user.role || 'USER',
      email: this.user.email
    };

    this.userService.register(payload).subscribe({
      next: (res: any) => {
        this.message = res?.message || 'Реєстрація успішна!';
        setTimeout(() => this.backToLogin.emit(), 1500);
      },
      error: (err) => this.message = err?.error?.message || 'Помилка при реєстрації'
    });
  }
}
