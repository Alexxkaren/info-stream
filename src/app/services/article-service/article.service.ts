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
            this.messageService.success('Articles have been loaded');
          }
        }),
        catchError((error) => this.errorHandling(error))
      );
  }

  addArticle(article: any): Observable<any> {
    const token = localStorage.getItem('token');  
    if (!token) {
      this.messageService.error('There is no authorization token');
      return EMPTY;
    }

    return this.httpClient
      .post(`${this.serverUrl}/add_article`, article, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .pipe(
        tap(() => this.messageService.success('Article has been added')),
        catchError((error) => this.errorHandling(error))
      );
  }

  deleteArticle(articleId: number): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.messageService.error('There is no authorization token');
      return EMPTY;
    }

    return this.httpClient
      .delete(`${this.serverUrl}/delete_article/${articleId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .pipe(
        tap(() => this.messageService.success('The article has been deleted')),
        catchError((error) => this.errorHandling(error))
      );
  }

  updateArticle(articleId: number, article: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.messageService.error('There is no authorization token');
      return EMPTY;
    }

    return this.httpClient
      .put(`${this.serverUrl}/update_article/${articleId}`, article, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .pipe(
        tap(() => this.messageService.success('The article has been edited')),
        catchError((error) => this.errorHandling(error))
      );
  }

  // Handle HTTP errors
  errorHandling(err: any): Observable<never> {
    if (err instanceof HttpErrorResponse) {
      if (err.status >= 400 && err.status < 500) {
        this.messageService.error('Bad request to server');
      } else {
        this.messageService.error('Server error');
      }
    }
    return EMPTY;
  }
}
