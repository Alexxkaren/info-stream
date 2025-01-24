import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
import { MatSelectModule } from '@angular/material/select';

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
    MatSelectModule,
    FormsModule
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css',
})
export class MainPageComponent implements OnInit {
  @ViewChild('dialogTemplateRegister')
    dialogTemplateRegister!: TemplateRef<any>;

  articles: ArticleDataDtoBase[] = [];
  displayedArticles: ArticleDataDtoBase[] = [];
  pageSize = 5;
  currentPage = 0;
  totalArticles = 0;
  expandedArticles: { [key: number]: boolean } = {};
  categories: string[] = ['Technology', 'Science', 'Art', 'Health', 'Sports'];
  selectedCategory: string = '';

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

  onCategoryChange(): void {
    this.currentPage = 0;
    this.updateDisplayedArticles();
  }

  private updateDisplayedArticles(): void {
    let filteredArticles = this.articles;

    if (this.selectedCategory) {
      filteredArticles = filteredArticles.filter(
        (article) => article.category === this.selectedCategory
      );
    }

    this.totalArticles = filteredArticles.length;

    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedArticles = filteredArticles.slice(startIndex, endIndex);
  }
}
