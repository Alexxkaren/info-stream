import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {  Injectable, signal } from '@angular/core';
import { BehaviorSubject, catchError, EMPTY, Observable, tap } from 'rxjs';
import { MessageService } from '../message-service/message.service';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class UserService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

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
            this.isLoggedInSubject.next(true);
            this.messageService.success('Používateľ ' + username + ' bol úspešne prihlásený');
          }
          this.navigateTo('/admin');
        }),
        catchError((error) => this.errorHandling(error))
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isLoggedInSubject.next(false);
    this.messageService.success('Používateľ bol úspešne odhlásený');
    this.navigateTo('/login');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  errorHandling(err: any): Observable<never> {
    if (err instanceof HttpErrorResponse) {
      if (err.status >= 400 && err.status < 500) {
        this.messageService.error('Zlé prihlasovacie údaje');
      } else {
        this.messageService.error('Server error');
      }
    }
    return EMPTY;
  }
}
