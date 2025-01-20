import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ArticleService } from '../../services/article-service/article.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ArticleDataDtoBase } from '../../models/article/article';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIcon } from '@angular/material/icon';

@Component({
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    CommonModule,
    MatPaginatorModule,
    MatIcon,
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css',
})
export class MainPageComponent implements OnInit {
  articles: ArticleDataDtoBase[] = [];
  displayedArticles: ArticleDataDtoBase[] = [];
  pageSize = 5;
  currentPage = 0;
  totalArticles = 0;
  expandedArticles: { [key: number]: boolean } = {};

  constructor(private articleService: ArticleService, private router: Router) {}

  ngOnInit(): void {
    this.articleService.getAllArticles().subscribe(
      (response) => {
        this.articles = response.articles;
        this.totalArticles = response.articles.length;
        this.updateDisplayedArticles();
      },
      (error) => {
        console.error('Error fetching articles:', error);
      }
    );
  }

  toggleArticle(articleId: number): void {
    this.expandedArticles[articleId] = !this.expandedArticles[articleId];
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updateDisplayedArticles();
  }

  private updateDisplayedArticles(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedArticles = this.articles.slice(startIndex, endIndex);
  }
}
