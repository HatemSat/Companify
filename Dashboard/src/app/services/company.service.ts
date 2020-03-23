import { environment } from './../../environments/environment';
import { Admin } from './../models/admin';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company } from 'src/app/models/company';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.apiUrl}/companies`);
  }

  getCompany(id: string): Observable<Company> {
    return this.http.get<Company>(`${this.apiUrl}/companies/${id}`);
  }

  addCompany(company: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/companies`, company);
  }

  putCompany(company: any, id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/companies/${id}`, company);
  }



}
