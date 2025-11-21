// src/app/components/advice-feedback/advice-feedback.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-advice-feedback',
  template: `
    <b>Оцініть пораду:</b><br>
    <div style="margin-top: 8px;">
      <span *ngFor="let i of [1,2,3,4,5]"
            (click)="rate(i)"
            [style.color]="i <= selected ? '#faad14' : '#d9d9d9'"
            style="font-size: 20px; cursor: pointer; margin-right: 4px;">
        star
      </span>
    </div>
    <p style="margin-top: 8px; font-size: 12px; color: #888;">
      Ваша оцінка покращить AI!
    </p>
  `,
  standalone: true,
  imports: [CommonModule]
})
export class AdviceFeedbackComponent {
  @Input() selected = 0;
  @Output() rated = new EventEmitter<number>();

  rate(stars: number) {
    this.selected = stars;
    this.rated.emit(stars);
  }
}