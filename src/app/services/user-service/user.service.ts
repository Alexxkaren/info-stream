import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  serverUrl: string = "http://infostream-core-gdaxc8guf3cpe5dz.westeurope-01.azurewebsites.net";

  login(username: string, password: string): Observable<any> {
    return this.httpClient.post(`${this.serverUrl}/login`, { username, password });
  }
}
