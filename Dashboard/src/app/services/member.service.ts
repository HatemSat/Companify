import { environment } from './../../environments/environment';
// import { MEMBERS } from './mock-members';
import { Injectable } from '@angular/core';
import { Member } from 'src/app/models/member';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.apiUrl}/members`);
  }

  getMember(id: string): Observable<Member> {
    return this.http.get<Member>(`${this.apiUrl}/members/${id}`);
  }

  addMember(newMember: Member): Observable<any> {
    return this.http.post(`${this.apiUrl}/members`, newMember);
  }

  putMember(editedMember: Member, id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/members/${id}`, editedMember);
  }


}
