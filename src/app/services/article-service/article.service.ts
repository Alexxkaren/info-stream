import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
    private router: Router
  ) {}

  serverUrl: string = 'http://infostream-core-gdaxc8guf3cpe5dz.westeurope-01.azurewebsites.net';

  getAllArticles(): Observable<any> {
    return this.httpClient
      .get(`${this.serverUrl}/articles`)
      .pipe(
        tap((response: any) => {
          if (response.articles) {
            this.messageService.success('Články sa načítali');
          }
        }),
        catchError((error) => this.errorHandling(error))
      );
  }

  addArticle(article: any): Observable<any> {
    const token = localStorage.getItem('token');  
    if (!token) {
      this.messageService.error('Neexistuje autorizačný token');
      return EMPTY;
    }

    return this.httpClient
      .post(`${this.serverUrl}/add_article`, article, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .pipe(
        tap(() => this.messageService.success('Článok bol pridaný')),
        catchError((error) => this.errorHandling(error))
      );
  }

  deleteArticle(articleId: number): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.messageService.error('Neexistuje autorizačný token');
      return EMPTY;
    }

    return this.httpClient
      .delete(`${this.serverUrl}/delete_article/${articleId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .pipe(
        tap(() => this.messageService.success('Článok bol zmazaný')),
        catchError((error) => this.errorHandling(error))
      );
  }

  updateArticle(articleId: number, article: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.messageService.error('Neexistuje autorizačný token');
      return EMPTY;
    }

    return this.httpClient
      .put(`${this.serverUrl}/update_article/${articleId}`, article, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .pipe(
        tap(() => this.messageService.success('Článok bol upravený')),
        catchError((error) => this.errorHandling(error))
      );
  }

  // Handle HTTP errors
  errorHandling(err: any): Observable<never> {
    if (err instanceof HttpErrorResponse) {
      if (err.status >= 400 && err.status < 500) {
        this.messageService.error('Zlá požiadavka pre server');
      } else {
        this.messageService.error('Server error');
      }
    }
    return EMPTY;
  }
}
