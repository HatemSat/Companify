import { environment } from './../../environments/environment';
import { BROWSER_STORAGE } from './storage';
import { Injectable, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Admin } from '../models/admin';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {


  defaultLogStatus: boolean;
  apiUrl = environment.apiUrl;
  // RxJs subject to inform components of current log status. It keeps state.
  private isLoggedInSource = new BehaviorSubject(this.defaultLogStatus);
  currentLogStatus = this.isLoggedInSource.asObservable();

  constructor(
    @Inject(BROWSER_STORAGE) private storage: Storage,
    private http: HttpClient) {
  }


  changeLogStatus(status: boolean) {
    this.isLoggedInSource.next(status);
  }

  getToken(): string {
    return this.storage.getItem('fb-token');
  }

  saveToken(token: string): void {
    this.storage.setItem('fb-token', token);
  }

  login(admin: Admin): Observable<any> {
    return this.http.post(`${this.apiUrl}/login/admin`, admin);
  }

  logout() {
    this.storage.removeItem('fb-token');
  }

  isLoggedIn(): boolean {
    const token: string = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log(payload);

      return payload.exp > (Date.now() / 1000);
    } else {
      return false;
    }
  }

}

