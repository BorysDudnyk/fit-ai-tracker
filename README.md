# fit-ai-tracker

FitnessWeb is a full-stack **fitness tracking system** built with:
- Backend: **Java 17 + Spring Boot**
- Frontend: **Angular 20**
- Database: **MySQL**
- AI Layer: TensorFlow.js + rule-based smart assistant

The system focuses on **fitness analytics, AI coaching, activity tracking, and personalized recommendations**.

---

## Development Tools

![Java JDK](https://img.shields.io/badge/JDK_17.0.16-007396?style=for-the-badge&logo=java&logoColor=white)
![IntelliJ IDEA](https://img.shields.io/badge/IntelliJ_IDEA-000000?style=for-the-badge&logo=intellijidea&logoColor=white)
![Maven](https://img.shields.io/badge/Maven_3.9.11-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js_22.19.0-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![npm](https://img.shields.io/badge/npm_10.9.3-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![Angular CLI](https://img.shields.io/badge/Angular_CLI_20.3.1-DD0031?style=for-the-badge&logo=angular&logoColor=white)

---

## Technologies

### Backend (Java / Spring Boot)

![Spring Web](https://img.shields.io/badge/Spring_Web-REST_API-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![Spring Data JPA](https://img.shields.io/badge/Spring_Data_JPA-ORM-6DB33F?style=for-the-badge)
![MySQL Driver](https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Lombok](https://img.shields.io/badge/Lombok-Boilerplate_Cleaning-CA0B0B?style=for-the-badge)

---

### Frontend (Angular)

![Angular](https://img.shields.io/badge/Angular-20-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Ng Zorro](https://img.shields.io/badge/NG_ZORRO-UI_Library-1890FF?style=for-the-badge)
![RxJS](https://img.shields.io/badge/RxJS-Reactive_Streams-B7178C?style=for-the-badge&logo=reactivex&logoColor=white)

---

### AI & Analytics

![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-AI_Engine-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-Analytics-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)
![jsPDF](https://img.shields.io/badge/jsPDF-PDF_Export-0B5394?style=for-the-badge)

---

## Project Focus

This project is built around 3 main pillars:

### 1. Fitness Tracking System
- Workouts tracking
- Daily activity (steps, calories, distance)
- Goal management system
- Progress analytics

### 2. AI Fitness Assistant
- Smart workout recommendations
- Intensity analysis
- Activity recognition (walk/run/workout detection)
- Training optimization suggestions
- Injury prevention insights

### 3. Data Integration Layer
- Fitness wearables support (planned)
- Apple Health integration (planned)
- Google Fit integration (planned)
- Smartwatch data sync (planned)

---

## Features

### Authentication & Users
- User registration (no encryption for learning/demo version)
- Login system
- Role-based structure (USER / ADMIN)
- Session state (Angular local state)

### Core Fitness Modules
- Workout tracking
- Activity tracking (steps, distance, calories)
- Goal system (create / update / complete)
- Achievements (gamification layer)
- Analytics dashboard (weekly/monthly stats)

### AI Features (Frontend + Logic Layer)
- AI Coach module
- Smart workout suggestions
- Basic anomaly detection (TensorFlow.js ready structure)
- Notification system (training reminders)
- Progress insights

### Extra Features
- Push notifications
- PDF export of reports (jsPDF)
- Interactive charts (Chart.js)
- Dashboard analytics

---

## Screenshots

### Performance Chart
![PerformanceChart](fitnessTrackerServer/Documentation/Performance/PerformanceChart.png)

### DB
![DB](fitnessTrackerServer/Documentation/Screenshot/DB/EERDiagramFitnessTracker.png)

### Login
![Login](fitnessTrackerServer/Documentation/Screenshot/fitnessTracker/Login.png)

### Welcome page
![Welcome](fitnessTrackerServer/Documentation/Screenshot/fitnessTracker/Welcome.png)

### Dashboard
![Dashboard](fitnessTrackerServer/Documentation/Screenshot/fitnessTracker/Dashboard.png)

### Workout page
![Workout](fitnessTrackerServer/Documentation/Screenshot/fitnessTracker/Training.png)

### Activity tracker
![Activity](fitnessTrackerServer/Documentation/Screenshot/fitnessTracker/Activity.png)

### Goal system
![Goal](fitnessTrackerServer/Documentation/Screenshot/fitnessTracker/Goal.png)

### Achievements
![Achievements](fitnessTrackerServer/Documentation/Screenshot/fitnessTracker/Achievements.png)

### AI Coach
![AI1](fitnessTrackerServer/Documentation/Screenshot/fitnessTracker/AI1.png)

---

## Backend Architecture

### Structure

```
controller/
dto/
entity/
repository/
services/
```

### Main Modules

#### Activity Module
- Tracks steps, distance, calories
- REST:
  - `POST /api/activity`
  - `GET /api/activities`

#### Workout Module
- Stores workout sessions
- REST:
  - `POST /api/workout`
  - `GET /api/workouts`

#### Goal Module
- Fitness goals management
- REST:
  - `POST /api/goal`
  - `GET /api/goals`
  - `GET /api/goal/status/{id}`

#### Stats Module
- Aggregates system data
- Provides:
  - total steps
  - calories burned
  - workout duration
  - achieved goals
- REST:
  - `GET /api/stats`
  - `GET /api/graphs`

#### User Module
- Registration & login
- REST:
  - `POST /api/register`
  - `POST /api/login`

---

## AI Coach

### 1. Smart Fitness Intelligence
- AI-based workout plan generation
- Adaptive intensity scaling
- Rest day prediction

### 2. Health Data Intelligence
- Detect fatigue patterns
- Injury risk detection
- Performance trend prediction

### 3. Activity Recognition AI
- Walking detection
- Running detection
- Workout classification

### 4. Recommendation Engine
- Personalized workout plans
- Nutrition suggestions (future)
- Recovery optimization

---

## Database Design

Main tables:
- users
- activity
- workout
- goal

Analytics:
- aggregated stats (computed via service layer)

---

## Setup Instructions

### Backend (Spring Boot)

```bash
mvn clean install
mvn spring-boot:run
```

## Database
```
CREATE DATABASE fitness_tracker_db;
```

## Frontend (Angular)
```
npm install
ng serve
```

### UI & Visualization
* Chart.js → progress analytics
* Ng Zorro → UI components
* PDF export → reports generation
* Responsive dashboard layout

