import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, EMPTY, Observable, tap } from 'rxjs';
import { MessageService } from '../message-service/message.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private httpClient: HttpClient,
    private messageService: MessageService,
    private router: Router
  ) {}

  serverUrl: string =
    'http://infostream-core-gdaxc8guf3cpe5dz.westeurope-01.azurewebsites.net';

  navigateTo(page: string): void {
    this.router.navigate([page]);
  }

  login(username: string, password: string): Observable<any> {
    return this.httpClient
      .post(`${this.serverUrl}/login`, { username, password })
      .pipe(
        tap((response: any) => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            this.messageService.success('User ' + username + ' was logged in');
          }
          this.navigateTo('/');
        }),
        catchError((error) => this.errorHandling(error))
      );
  }

  errorHandling(err: any): Observable<never> {
    if (err instanceof HttpErrorResponse) {
      if (err.status >= 400 && err.status < 500) {
        this.messageService.error('Invalid username or password');
      }
      if (err.status >= 400 && err.status < 500) {
        this.messageService.error('Invalid username or password');
      } else {
        this.messageService.error('Server error');
      }
    }
    return EMPTY;
  }
}
