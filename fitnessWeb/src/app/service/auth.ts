import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class Auth {
  username = signal('Гість');
  private isBrowser: boolean;

  constructor(private router: Router, @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      const stored = localStorage.getItem('username');
      if (stored) {
        this.username.set(stored);
      }
    }
  }

  setUsername(name: string) {
    this.username.set(name);
    if (this.isBrowser) {
      localStorage.setItem('username', name);
    }
  }

  logout() {
    this.username.set('Гість');
    if (this.isBrowser) {
      localStorage.removeItem('username');
    }
    this.router.navigate(['/login']);
  }
}
