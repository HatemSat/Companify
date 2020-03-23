import { Expert } from './../models/expert';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpertService {

  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getExperts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/experts`);
  }

  getExpert(id: string): Observable<Expert> {
    return this.http.get<Expert>(`${this.apiUrl}/experts/${id}`);
  }

  addExpert(newExpert: Expert): Observable<any> {
    return this.http.post(`${this.apiUrl}/experts`, newExpert);
  }

  putExpert(editedExpert: Expert, id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/experts/${id}`, editedExpert);
  }




}
