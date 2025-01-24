import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ArticleService } from '../../services/article-service/article.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ArticleDataDtoBase } from '../../models/article/article';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-admin',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIcon,
    MatSelectModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatPaginatorModule
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
  @ViewChild('dialogTemplateRegister')
  dialogTemplateRegister!: TemplateRef<any>;

  articles: ArticleDataDtoBase[] = [];
  dialog = inject(MatDialog);
  displayedArticles: ArticleDataDtoBase[] = [];
  pageSize = 5;
  currentPage = 0;
  totalArticles = 0;
categories: string[] = ['Technology', 'Science', 'Art', 'Health', 'Sports'];
editingArticleId: number | null = null;


  constructor(private articleService: ArticleService, private router: Router) {}

  regForm = new FormGroup({
    title: new FormControl<string>('', {
      validators: [Validators.required, Validators.minLength(3)],
    }),
    category: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    content: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
    ]),
  });

  get title() {
    return this.regForm.get('title');
  }
  get category() {
    return this.regForm.get('category');
  }
  get content() {
    return this.regForm.get('content');
  }

  ngOnInit(): void {
    this.articleService.getAllArticles().subscribe(
      (response) => {
        console.log('Fetched Articles:', response);
        this.articles = response.articles;
        this.totalArticles = response.articles.length;
        this.updateDisplayedArticles();
      },
      (error) => {
        console.error('Error fetching articles:', error);
      }
    );
  }

  updateArticle(article: ArticleDataDtoBase): void {
    this.editingArticleId = article.id;
    this.openDialog(article);
  }
  

  deleteArticle(articleId: number): void {
    console.log('Delete article with ID:', articleId);
    this.articleService.deleteArticle(articleId).subscribe(
      () => {
        console.log('Article deleted successfully');
        this.articles = this.articles.filter(
          (article) => article.id !== articleId
        );
      },
      (error) => {
        console.error('Error deleting article:', error);
      }
    );
  }

  openDialog(article?: ArticleDataDtoBase): void {
    if (article) {
      this.regForm.patchValue({
        title: article.title,
        category: article.category,
        content: article.content,
      });
    } else {
      this.regForm.reset();
    }
  
    this.dialog.open(this.dialogTemplateRegister, {
      width: '600px',
    });
  }

  closeDialog(): void {
    this.editingArticleId = null;
    this.dialog.closeAll();
  }
  

  submit() {
    if (this.regForm.valid) {
      const articleData = this.regForm.value;
  
      if (this.editingArticleId) {
        this.articleService.updateArticle(this.editingArticleId, articleData).subscribe(
          () => {
            console.log('Article updated successfully');
            this.editingArticleId = null;
            this.dialog.closeAll();
            this.ngOnInit();
          },
          (error) => {
            console.error('Error updating article:', error);
          }
        );
      } else {
        // Add new article
        this.articleService.addArticle(articleData).subscribe(
          () => {
            console.log('Article added successfully');
            this.dialog.closeAll();
            this.ngOnInit();
          },
          (error) => {
            console.error('Error adding article:', error);
          }
        );
      }
    } else {
      console.error('Form is invalid');
    }
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
