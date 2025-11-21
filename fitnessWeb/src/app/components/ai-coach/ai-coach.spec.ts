import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AiCoach } from './ai-coach'; // Правильний імпорт

describe('AiCoach', () => { // Назва тесту — по класу
  let component: AiCoach;
  let fixture: ComponentFixture<AiCoach>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiCoach] // Standalone компонент
    }).compileComponents();

    fixture = TestBed.createComponent(AiCoach);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default formData', () => {
    expect(component.formData).toBeDefined();
  });
});