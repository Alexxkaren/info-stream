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

  // URL to your Flask server
  serverUrl: string = 'http://infostream-core-gdaxc8guf3cpe5dz.westeurope-01.azurewebsites.net';

  // Retrieve all articles
  getAllArticles(): Observable<any> {
    return this.httpClient
      .get(`${this.serverUrl}/articles`)
      .pipe(
        tap((response: any) => {
          if (response.articles) {
            this.messageService.success('Articles loaded');
          }
        }),
        catchError((error) => this.errorHandling(error))
      );
  }

  // Add a new article (requires JWT token for authorization)
  addArticle(article: any): Observable<any> {
    const token = localStorage.getItem('token');  // Assuming token is saved in localStorage after login
    if (!token) {
      this.messageService.error('No authorization token found');
      return EMPTY;
    }

    return this.httpClient
      .post(`${this.serverUrl}/add_article`, article, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .pipe(
        tap(() => this.messageService.success('Article added')),
        catchError((error) => this.errorHandling(error))
      );
  }

  deleteArticle(articleId: number): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.messageService.error('No authorization token found');
      return EMPTY;
    }

    return this.httpClient
      .delete(`${this.serverUrl}/delete_article/${articleId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .pipe(
        tap(() => this.messageService.success('Article deleted')),
        catchError((error) => this.errorHandling(error))
      );
  }

  updateArticle(articleId: number, article: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.messageService.error('No authorization token found');
      return EMPTY;
    }

    return this.httpClient
      .put(`${this.serverUrl}/update_article/${articleId}`, article, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .pipe(
        tap(() => this.messageService.success('Article updated')),
        catchError((error) => this.errorHandling(error))
      );
  }

  // Handle HTTP errors
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
