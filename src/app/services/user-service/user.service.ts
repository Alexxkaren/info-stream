import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {  Injectable, signal } from '@angular/core';
import { BehaviorSubject, catchError, EMPTY, Observable, tap } from 'rxjs';
import { MessageService } from '../message-service/message.service';
import { Router } from '@angular/router';
import { UserLoginDtoOut } from '../../models/user/user';


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

  serverUrl: string = 'http://127.0.0.1:5000';

  navigateTo(page: string): void {
    this.router.navigate([page]);
  }

  login(username: string, password: string): Observable<UserLoginDtoOut> {
      return this.httpClient
        .post<UserLoginDtoOut>(`${this.serverUrl}/login`, { username, password })
        .pipe(
          tap((response: UserLoginDtoOut) => {
            if (response.token) {
              localStorage.setItem('token', response.token);
              this.isLoggedInSubject.next(true);
              this.messageService.success('User ' + username + ' was successfully logged in');
            }
          }),
          catchError((error) => this.errorHandling(error))
        );
    }

  logout(): void {
    localStorage.removeItem('token');
    this.isLoggedInSubject.next(false);
    this.messageService.success('The user has been successfully logged out');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  errorHandling(err: any): Observable<never> {
    if (err instanceof HttpErrorResponse) {
      if (err.status >= 400 && err.status < 500) {
        this.messageService.error('Bad credentials');
      } else {
        this.messageService.error('Server error');
      }
    }
    return EMPTY;
  }
}
