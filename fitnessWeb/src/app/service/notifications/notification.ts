import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  sendNotification(title: string, body: string) {
    if (isPlatformBrowser(this.platformId) && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(title, { body });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification(title, { body });
          }
        });
      }
    } else if (isPlatformBrowser(this.platformId)) {
      // fallback: просте alert у браузері
      alert(`${title}\n${body}`);
    } else {
      // серверна сторона – нічого не робимо
      console.log(`Notification skipped on server: ${title}`);
    }
  }
}
