import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  serverUrl: string = "http://localhost:5000";

  login(username: string, password: string): Observable<any> {
    return this.httpClient.post(`${this.serverUrl}/login`, { username, password });
  }
}
