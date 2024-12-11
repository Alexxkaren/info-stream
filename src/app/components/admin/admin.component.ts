import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ArticleService } from '../../services/article-service/article.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ArticleDataDtoBase } from '../../models/article/article';

@Component({
  selector: 'app-admin',
  imports: [    
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIcon,
    FormsModule,
    CommonModule,],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  articles: ArticleDataDtoBase[] = [];

  constructor(private articleService: ArticleService, private router: Router) {}

  ngOnInit(): void {
    this.articleService.getAllArticles().subscribe(
      (response) => {
        console.log('Fetched Articles:', response);
        this.articles = response.articles; 
      },
      (error) => {
        console.error('Error fetching articles:', error);
      }
    );
  }

  updateArticle(article: ArticleDataDtoBase): void {
    console.log('Update article:', article);
    this.router.navigate(['/edit-article', article.id]);
  }
  
  deleteArticle(articleId: number): void {
    console.log('Delete article with ID:', articleId);
    this.articleService.deleteArticle(articleId).subscribe(
      () => {
        console.log('Article deleted successfully');
        this.articles = this.articles.filter(article => article.id !== articleId);
      },
      (error) => {
        console.error('Error deleting article:', error);
      }
    );
  }
}
