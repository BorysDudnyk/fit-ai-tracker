import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const BASIC_URL = "http://localhost:8080/";

export interface UserDTO {
  username?: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  birthDate: string;
  gender: string;
  countryCity: string;
  profilePhoto?: string | null;
  role: string;
  email: string;
}



@Injectable({
  providedIn: 'root'
})
export class User {

  constructor(private http: HttpClient) {}

  // 🔹 Реєстрація
  register(user: UserDTO): Observable<any> {
    return this.http.post(BASIC_URL + "api/register", user);
  }

  // 🔹 Логін (мінімально username/email + password)
  login(loginData: { email: string; password: string }): Observable<any> {
    return this.http.post(BASIC_URL + "api/login", loginData);
  }

  // --- Activity ---
  postActivity(activityDto: any): Observable<any> {
    return this.http.post(BASIC_URL + "api/activity", activityDto);
  }

  getActivity(): Observable<any> {
    return this.http.get(BASIC_URL + "api/activities");
  }

  // --- Workout ---
  postWorkout(workoutDto: any): Observable<any> {
    return this.http.post(BASIC_URL + "api/workout", workoutDto);
  }

  getWorkouts(): Observable<any> {
    return this.http.get(BASIC_URL + "api/workouts");
  }

  // --- Goal ---
  postGoal(goalDto: any): Observable<any> {
    return this.http.post(BASIC_URL + "api/goal", goalDto);
  }

  getGoals(): Observable<any> {
    return this.http.get(BASIC_URL + "api/goals");
  }

  updateGoalStatus(id: number): Observable<any> {
    return this.http.get(BASIC_URL + "api/goal/status/" + id);
  }

  // --- Статистика ---
  getStats(): Observable<any> {
    return this.http.get(BASIC_URL + "api/stats");
  }

  getGraphStats(): Observable<any> {
    return this.http.get(BASIC_URL + "api/graphs");
  }
}
