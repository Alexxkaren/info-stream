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
  selector: 'app-main-page',
  imports: [    
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    CommonModule,],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css',
})
export class MainPageComponent implements OnInit {
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
  
}
