// src/app/service/ai/ai-coach-modal.service.ts
import { Injectable } from '@angular/core';
import { NzModalService, NzModalRef } from 'ng-zorro-antd/modal';
import { UserDataService } from './user-data';

@Injectable({ providedIn: 'root' })
export class AiCoachModalService {
  private activeModal: NzModalRef | null = null;

  constructor(
    private modal: NzModalService,
    private userData: UserDataService
  ) {}

  showHistory(): void {
    this.closeActive();
    const data = this.userData.getAll();
    if (data.length === 0) {
      this.modal.info({
        nzTitle: 'Історія порожня',
        nzContent: 'Оцініть хоча б одну пораду!',
        nzCentered: true
      });
      return;
    }

    const avg = data.reduce((s, d) => s + d.result, 0) / data.length * 5;

    this.activeModal = this.modal.create({
      nzTitle: 'Історія оцінок користувача',
      nzContent: `
        <div style="margin-bottom: 16px; font-weight: 600;">
          Всього оцінок: ${data.length} | Середній бал: ${avg.toFixed(1)} з 5
        </div>
        <div style="max-height: 400px; overflow-y: auto;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead style="position: sticky; top: 0; background: #fafafa; z-index: 1;">
              <tr style="border-bottom: 2px solid #f0f0f0;">
                <th style="text-align: left; padding: 8px;">Дата</th>
                <th style="text-align: left; padding: 8px;">Сон</th>
                <th style="text-align: left; padding: 8px;">Стрес</th>
                <th style="text-align: left; padding: 8px;">Активність</th>
                <th style="text-align: left; padding: 8px;">Оцінка</th>
                <th style="text-align: left; padding: 8px;">Прогрес</th>
              </tr>
            </thead>
            <tbody>
              ${data.map(item => `
                <tr style="border-bottom: 1px solid #f0f0f0;">
                  <td style="padding: 8px;">${new Date(item.timestamp).toLocaleString('uk-UA', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                  <td style="padding: 8px;">${(item.input[0] * 10).toFixed(1)} год</td>
                  <td style="padding: 8px;">${(item.input[1] * 10).toFixed(1)}</td>
                  <td style="padding: 8px;">${((item.input[2] * 0.7) + 1.2).toFixed(2)}</td>
                  <td style="padding: 8px;">
                    ${[1,2,3,4,5].map(i => `<span style="color: ${i <= Math.round(item.result * 5) ? '#faad14' : '#d9d9d9'}; font-size: 16px; margin-right: 2px;">star</span>`).join('')}
                  </td>
                  <td style="padding: 8px;">${(item.result * 100).toFixed(1)}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `,
      nzWidth: 900,
      nzFooter: [
        {
          label: 'Закрити',
          onClick: () => this.activeModal?.close()
        },
        {
          label: 'Експорт у JSON',
          type: 'primary',
          onClick: () => this.exportHistory()
        }
      ]
    });
  }

  clearData(): void {
    this.modal.confirm({
      nzTitle: 'Очистити історію?',
      nzContent: 'Всі оцінки будуть видалені назавжди.',
      nzOkText: 'Так, очистити',
      nzCancelText: 'Скасувати',
      nzOnOk: () => {
        this.userData.clear();
        this.modal.info({ nzTitle: 'Готово', nzContent: 'Історія очищена.' });
      }
    });
  }

  importData(fileInput: HTMLInputElement): void {
    fileInput.value = '';
    fileInput.click();
  }

  handleImport(event: Event, onSuccess: (count: number) => void): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        if (!Array.isArray(imported)) throw new Error();

        let count = 0;
        imported.forEach((item: any) => {
          if (Array.isArray(item.input) && typeof item.result === 'number') {
            this.userData.add(item.input, item.result);
            count++;
          }
        });

        onSuccess(count);
      } catch {
        this.modal.error({ nzTitle: 'Помилка', nzContent: 'Невірний формат файлу. Потрібен JSON-масив.' });
      }
    };
    reader.readAsText(file);
  }

  private exportHistory(): void {
    const data = this.userData.getAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-coach-history-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  private closeActive(): void {
    this.activeModal?.close();
    this.activeModal = null;
  }
}