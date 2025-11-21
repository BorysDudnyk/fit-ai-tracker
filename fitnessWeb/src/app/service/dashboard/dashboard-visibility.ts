import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DashboardVisibilityService {
  private handler?: () => void;

  register(handler: () => void) {
    this.handler = handler;
    document.addEventListener('visibilitychange', this.listener);
  }

  unregister() {
    document.removeEventListener('visibilitychange', this.listener);
  }

  private listener = () => {
    if (document.visibilityState === 'visible' && this.handler) {
      this.handler();
    }
  };
}
