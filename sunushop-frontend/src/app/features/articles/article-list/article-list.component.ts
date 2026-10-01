import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ArticleService } from '../../../core/services/article.service';
import { Article } from '../../../shared/models/article.model';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <div class="header">
        <div>
          <h1>Liste des articles</h1>
          <p class="subtitle">Total : {{ articles.length }} article(s)</p>
        </div>
        <div class="actions">
          <a routerLink="/dashboard" class="btn-dashboard">
            Dashboard
          </a>
          <a routerLink="/stocks/movement" class="btn-movement">
            Mouvement
          </a>
          <a routerLink="/reservations" class="btn-reservation">
            Reservations
          </a>
          <a routerLink="/articles/new" class="btn-new">
            + Article
          </a>
        </div>
      </div>

      <div *ngIf="loading" class="loading">Chargement...</div>

      <table *ngIf="!loading && articles.length > 0">
        <thead>
          <tr>
            <th>Reference</th>
            <th>Designation</th>
            <th>Categorie</th>
            <th>Stock physique</th>
            <th>Reserve</th>
            <th>Disponible</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let article of articles">
            <td><strong>{{ article.reference }}</strong></td>
            <td>{{ article.designation }}</td>
            <td><span class="badge">{{ article.category }}</span></td>
            <td>{{ article.currentStockPhysical }}</td>
            <td>{{ article.currentStockReserved }}</td>
            <td><strong class="available">{{ article.currentStockPhysical - article.currentStockReserved }}</strong></td>
          </tr>
        </tbody>
      </table>

      <p *ngIf="!loading && articles.length === 0" class="empty">Aucun article pour le moment</p>
      <p *ngIf="error" class="error">{{ error }}</p>
    </div>
  `,
  styles: [`
    .container { padding: 30px; max-width: 1200px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    h1 { color: #2c3e50; margin: 0 0 5px 0; }
    .subtitle { color: #7f8c8d; margin: 0; }
    .actions { display: flex; gap: 8px; }
    .btn-dashboard { background: #34495e; color: white; padding: 10px 16px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 13px; }
    .btn-dashboard:hover { background: #2c3e50; }
    .btn-movement { background: #f39c12; color: white; padding: 10px 16px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 13px; }
    .btn-movement:hover { background: #e67e22; }
    .btn-reservation { background: #9b59b6; color: white; padding: 10px 16px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 13px; }
    .btn-reservation:hover { background: #8e44ad; }
    .btn-new { background: #27ae60; color: white; padding: 10px 16px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 13px; }
    .btn-new:hover { background: #229954; }
    .loading { text-align: center; padding: 40px; color: #3498db; font-size: 18px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden; }
    th { background: #3498db; color: white; padding: 15px; text-align: left; font-size: 14px; text-transform: uppercase; }
    td { padding: 15px; border-bottom: 1px solid #ecf0f1; }
    tr:hover { background: #f8f9fa; }
    .badge { background: #e74c3c; color: white; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: bold; }
    .available { color: #27ae60; font-size: 16px; }
    .empty { text-align: center; color: #95a5a6; padding: 60px; font-size: 16px; background: white; border-radius: 8px; margin-top: 20px; }
    .error { color: #e74c3c; background: #ffe6e6; padding: 15px; border-radius: 5px; margin-top: 20px; }
  `]
})
export class ArticleListComponent implements OnInit {
  articles: Article[] = [];
  loading = true;
  error = '';

  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.articleService.getAll().subscribe({
      next: (data) => {
        this.articles = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur de chargement : ' + (err.message || err.status);
        this.loading = false;
      }
    });
  }
}