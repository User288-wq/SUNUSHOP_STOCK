import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ArticleService } from '../../core/services/article.service';
import { ReservationService } from '../../core/services/reservation.service';
import { Article } from '../../shared/models/article.model';
import { Reservation } from '../../shared/models/reservation.model';

interface CategoryStats {
  name: string;
  count: number;
  totalStock: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <div class="header">
        <div>
          <h1>Tableau de bord</h1>
          <p class="subtitle">Vue d'ensemble de votre stock</p>
        </div>
        <div class="actions">
          <a routerLink="/articles" class="btn-secondary">Articles</a>
          <a routerLink="/reservations" class="btn-secondary">Reservations</a>
          <a routerLink="/stocks/movement" class="btn-primary">Mouvement</a>
        </div>
      </div>

      <div *ngIf="loading" class="loading">Chargement...</div>

      <div *ngIf="!loading" class="stats-grid">
        <div class="stat-card blue">
          <div class="stat-icon">A</div>
          <div class="stat-value">{{ articles.length }}</div>
          <div class="stat-label">Articles</div>
        </div>

        <div class="stat-card green">
          <div class="stat-icon">U</div>
          <div class="stat-value">{{ totalStock }}</div>
          <div class="stat-label">Unites en stock</div>
        </div>

        <div class="stat-card orange">
          <div class="stat-icon">A</div>
          <div class="stat-value">{{ lowStockCount }}</div>
          <div class="stat-label">Alertes stock</div>
        </div>

        <div class="stat-card purple">
          <div class="stat-icon">R</div>
          <div class="stat-value">{{ reservations.length }}</div>
          <div class="stat-label">Reservations</div>
        </div>
      </div>

      <div *ngIf="!loading" class="panel">
        <h2>Top 5 articles par stock physique</h2>
        <div class="bar-chart">
          <div *ngFor="let a of topArticles" class="bar-row">
            <div class="bar-label">{{ a.reference }}</div>
            <div class="bar-track">
              <div class="bar-fill" [style.width.%]="getBarWidth(a)"></div>
            </div>
            <div class="bar-value">{{ a.currentStockPhysical }}</div>
          </div>
          <p *ngIf="topArticles.length === 0" class="empty-small">Aucun article</p>
        </div>
      </div>

      <div *ngIf="!loading" class="panel">
        <h2>Repartition par categorie</h2>
        <table class="category-table">
          <thead>
            <tr>
              <th>Categorie</th>
              <th>Nombre d'articles</th>
              <th>Total unites</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of categoryStats">
              <td><strong>{{ c.name }}</strong></td>
              <td>{{ c.count }}</td>
              <td>{{ c.totalStock }}</td>
            </tr>
            <tr *ngIf="categoryStats.length === 0">
              <td colspan="3" class="empty-small">Aucune donnee</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="!loading" class="panel">
        <h2>Reservations recentes</h2>
        <table class="category-table">
          <thead>
            <tr>
              <th>Article</th>
              <th>Client</th>
              <th>Quantite</th>
              <th>Expire le</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let r of reservations">
              <td><strong>{{ getArticleReference(r.articleId) }}</strong></td>
              <td>Client {{ r.clientId }}</td>
              <td>{{ r.quantity }}</td>
              <td>{{ formatDate(r.expiresAt) }}</td>
            </tr>
            <tr *ngIf="reservations.length === 0">
              <td colspan="4" class="empty-small">Aucune reservation active</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 30px; max-width: 1200px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
    h1 { color: #2c3e50; margin: 0 0 5px 0; }
    .subtitle { color: #7f8c8d; margin: 0; }
    .actions { display: flex; gap: 10px; }
    .btn-primary { background: #3498db; color: white; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; }
    .btn-primary:hover { background: #2980b9; }
    .btn-secondary { background: #95a5a6; color: white; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; }
    .btn-secondary:hover { background: #7f8c8d; }
    .loading { text-align: center; padding: 60px; color: #3498db; font-size: 18px; }

    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
    .stat-card { padding: 25px; border-radius: 12px; color: white; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .stat-card.blue { background: linear-gradient(135deg, #3498db, #2980b9); }
    .stat-card.green { background: linear-gradient(135deg, #27ae60, #229954); }
    .stat-card.orange { background: linear-gradient(135deg, #f39c12, #e67e22); }
    .stat-card.purple { background: linear-gradient(135deg, #9b59b6, #8e44ad); }
    .stat-icon { font-size: 32px; font-weight: bold; opacity: 0.4; margin-bottom: 10px; }
    .stat-value { font-size: 36px; font-weight: bold; line-height: 1; }
    .stat-label { font-size: 13px; opacity: 0.9; margin-top: 5px; text-transform: uppercase; letter-spacing: 0.5px; }

    .panel { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 20px; }
    .panel h2 { color: #2c3e50; margin: 0 0 20px 0; font-size: 18px; }

    .bar-chart { display: flex; flex-direction: column; gap: 12px; }
    .bar-row { display: grid; grid-template-columns: 120px 1fr 60px; align-items: center; gap: 15px; }
    .bar-label { font-weight: 600; color: #2c3e50; font-size: 14px; }
    .bar-track { background: #ecf0f1; height: 24px; border-radius: 12px; overflow: hidden; }
    .bar-fill { background: linear-gradient(90deg, #3498db, #27ae60); height: 100%; border-radius: 12px; transition: width 0.5s; }
    .bar-value { font-weight: bold; color: #27ae60; text-align: right; font-size: 14px; }

    .category-table { width: 100%; border-collapse: collapse; }
    .category-table th { background: #f8f9fa; color: #2c3e50; padding: 12px; text-align: left; font-size: 13px; text-transform: uppercase; border-bottom: 2px solid #ecf0f1; }
    .category-table td { padding: 12px; border-bottom: 1px solid #ecf0f1; }
    .category-table tr:hover { background: #f8f9fa; }
    .empty-small { text-align: center; color: #95a5a6; padding: 20px; font-style: italic; }

    @media (max-width: 768px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .bar-row { grid-template-columns: 80px 1fr 50px; gap: 8px; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  articles: Article[] = [];
  reservations: Reservation[] = [];
  loading = true;

  totalStock = 0;
  lowStockCount = 0;
  topArticles: Article[] = [];
  categoryStats: CategoryStats[] = [];
  maxStock = 1;

  constructor(
    private articleService: ArticleService,
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    this.articleService.getAll().subscribe({
      next: (data) => {
        this.articles = data;
        this.calculateStats();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur articles:', err);
        this.loading = false;
      }
    });

    this.reservationService.getActive().subscribe({
      next: (data) => { this.reservations = data; },
      error: (err) => { console.error('Erreur reservations:', err); }
    });
  }

  calculateStats(): void {
    // Total stock
    this.totalStock = this.articles.reduce(
      (sum, a) => sum + a.currentStockPhysical, 0
    );

    // Alertes stock (seuil < 10 unités)
    this.lowStockCount = this.articles.filter(
      a => a.currentStockPhysical < 10
    ).length;

    // Top 5 articles
    this.topArticles = [...this.articles]
      .sort((a, b) => b.currentStockPhysical - a.currentStockPhysical)
      .slice(0, 5);

    this.maxStock = this.topArticles.length > 0
      ? this.topArticles[0].currentStockPhysical
      : 1;

    // Repartition par categorie
    const categoryMap = new Map<string, CategoryStats>();
    this.articles.forEach(a => {
      const cat = a.category || 'Sans categorie';
      const existing = categoryMap.get(cat) || { name: cat, count: 0, totalStock: 0 };
      existing.count++;
      existing.totalStock += a.currentStockPhysical;
      categoryMap.set(cat, existing);
    });
    this.categoryStats = Array.from(categoryMap.values())
      .sort((a, b) => b.totalStock - a.totalStock);
  }

  getBarWidth(article: Article): number {
    if (this.maxStock === 0) return 0;
    return (article.currentStockPhysical / this.maxStock) * 100;
  }

  getArticleReference(articleId: number): string {
    const a = this.articles.find(x => x.id === articleId);
    return a ? a.reference : 'Article #' + articleId;
  }

  formatDate(date?: string): string {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
}