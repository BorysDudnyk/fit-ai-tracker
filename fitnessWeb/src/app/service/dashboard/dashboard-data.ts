import { Injectable } from '@angular/core';
import { User } from '../user';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardDataService {
  constructor(private user: User) {}

  getStats(): Observable<any> {
    return this.user.getStats();
  }

  getGraphStats(): Observable<any> {
    return this.user.getGraphStats();
  }
}
