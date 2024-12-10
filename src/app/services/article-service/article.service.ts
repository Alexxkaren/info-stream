import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {  Injectable, signal } from '@angular/core';
import { BehaviorSubject, catchError, EMPTY, Observable, tap } from 'rxjs';
import { MessageService } from '../message-service/message.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(    
    private httpClient: HttpClient,
    private messageService: MessageService,
    private router: Router) { }

    serverUrl: string =
    'http://infostream-core-gdaxc8guf3cpe5dz.westeurope-01.azurewebsites.net';

    getAllArticles(): Observable<any> {
      return this.httpClient
        .get(`${this.serverUrl}/articles`, {})
        .pipe(
          tap((response: any) => {
            if (response.articles) {
              this.messageService.success('Articles loaded');
            }
          }),
          catchError((error) => this.errorHandling(error))
        );
    }
    

    errorHandling(err: any): Observable<never> {
      if (err instanceof HttpErrorResponse) {
        if (err.status >= 400 && err.status < 500) {
          this.messageService.error('Bad request for articles');
        } else {
          this.messageService.error('Server error');
        }
      }
      return EMPTY;
    }
}
