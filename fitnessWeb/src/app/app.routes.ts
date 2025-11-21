import { Routes } from '@angular/router';
import { Activity } from './components/activity/activity';
import { Workout } from './components/workout/workout';
import { Goal } from './components/goal/goal';
import { Dashboard } from './components/dashboard/dashboard';
import { Register } from './components/register/register';
import { Login } from './components/login/login';
import { AiCoach } from './components/ai-coach/ai-coach';
import { Welcome } from './components/welcome/welcome';
import { Achievements } from './components/achievements/achievements';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'welcome', component: Welcome },
    { path: "activity", component: Activity},
    { path: "workout", component: Workout},
    { path: "goal", component: Goal},
    { path: "dashboard", component: Dashboard},
    { path: 'register', component: Register },
    { path: 'login', component: Login },
    { path: 'ai-coach', component: AiCoach },
    { path: 'achievements', component: Achievements },
];
