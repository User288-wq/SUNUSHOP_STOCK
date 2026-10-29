import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ArticleService } from '../../../core/services/article.service';
import { Article } from '../../../shared/models/article.model';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container">
      <div class="header">
        <div>
          <h1>Liste des articles</h1>
          <p class="subtitle">Total : {{ totalElements }} article(s)</p>
        </div>
        <div class="actions">
          <button (click)="exportToCsv()" class="btn-export">📥 Exporter CSV</button>
          <a routerLink="/dashboard" class="btn-dashboard">Dashboard</a>
          <a routerLink="/stocks/movement" class="btn-movement">Mouvement</a>
          <a routerLink="/reservations" class="btn-reservation">Reservations</a>
          <a *ngIf="authService.isAdmin()" routerLink="/articles/new" class="btn-new">+ Article</a>
          <!-- BOUTON UTILISATEURS AJOUTÉ ICI -->
          <a *ngIf="authService.isAdmin()" routerLink="/users" class="btn-users">👥 Utilisateurs</a>
        </div>
      </div>

      <div class="search-bar">
        <input 
          type="text" 
          [(ngModel)]="searchQuery" 
          (keyup.enter)="onSearch()" 
          placeholder="Rechercher par référence ou désignation..." 
          class="search-input">
        <button (click)="onSearch()" class="btn-search">Rechercher</button>
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
          <tr *ngFor="let article of articles" [class.low-stock]="article.currentStockPhysical < 10">
            <td><strong>{{ article.reference }}</strong></td>
            <td>
              {{ article.designation }}
              <span class="badge-low" *ngIf="article.currentStockPhysical < 10">⚠️ Stock bas</span>
            </td>
            <td><span class="badge">{{ article.category }}</span></td>
            <td>{{ article.currentStockPhysical }}</td>
            <td>{{ article.currentStockReserved }}</td>
            <td><strong class="available">{{ article.currentStockPhysical - article.currentStockReserved }}</strong></td>
          </tr>
        </tbody>
      </table>

      <p *ngIf="!loading && articles.length === 0" class="empty">Aucun article trouvé.</p>

      <div class="pagination" *ngIf="totalPages > 1">
        <button 
          (click)="previousPage()" 
          [disabled]="currentPage === 0"
          class="btn-page">
          ← Précédent
        </button>
        
        <span class="page-info">Page {{ currentPage + 1 }} sur {{ totalPages }}</span>
        
        <button 
          (click)="nextPage()" 
          [disabled]="currentPage >= totalPages - 1"
          class="btn-page">
          Suivant →
        </button>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 30px; max-width: 1200px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 10px; }
    h1 { color: #2c3e50; margin: 0 0 5px 0; }
    .subtitle { color: #7f8c8d; margin: 0; }
    .actions { display: flex; gap: 8px; flex-wrap: wrap; }
    .btn-export { background: #16a085; color: white; padding: 10px 16px; border-radius: 8px; border: none; font-weight: 600; font-size: 13px; cursor: pointer; transition: 0.2s; }
    .btn-export:hover { background: #117a65; }
    .btn-dashboard { background: #34495e; color: white; padding: 10px 16px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 13px; }
    .btn-dashboard:hover { background: #2c3e50; }
    .btn-movement { background: #f39c12; color: white; padding: 10px 16px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 13px; }
    .btn-movement:hover { background: #e67e22; }
    .btn-reservation { background: #9b59b6; color: white; padding: 10px 16px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 13px; }
    .btn-reservation:hover { background: #8e44ad; }
    .btn-new { background: #27ae60; color: white; padding: 10px 16px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 13px; }
    .btn-new:hover { background: #229954; }
    /* STYLE DU BOUTON UTILISATEURS AJOUTÉ ICI */
    .btn-users { background: #8e44ad; color: white; padding: 10px 16px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 13px; }
    .btn-users:hover { background: #71368a; }
    
    .search-bar { display: flex; gap: 10px; margin-bottom: 20px; }
    .search-input { flex: 1; padding: 12px; border: 1px solid #ccc; border-radius: 8px; font-size: 15px; outline: none; }
    .search-input:focus { border-color: #3498db; }
    .btn-search { background: #3498db; color: white; border: none; padding: 12px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: 0.2s; }
    .btn-search:hover { background: #2980b9; }
    
    .loading { text-align: center; padding: 40px; color: #3498db; font-size: 18px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden; }
    th { background: #3498db; color: white; padding: 15px; text-align: left; font-size: 14px; text-transform: uppercase; }
    td { padding: 15px; border-bottom: 1px solid #ecf0f1; }
    tr:hover { background: #f8f9fa; }
    .badge { background: #e74c3c; color: white; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: bold; }
    .available { color: #27ae60; font-size: 16px; }
    .empty { text-align: center; color: #95a5a6; padding: 60px; font-size: 16px; background: white; border-radius: 8px; margin-top: 20px; }
    
    .pagination { display: flex; justify-content: center; align-items: center; gap: 20px; margin-top: 30px; }
    .btn-page { background: #ecf0f1; color: #2c3e50; border: 1px solid #bdc3c7; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: 0.2s; }
    .btn-page:hover:not(:disabled) { background: #bdc3c7; }
    .btn-page:disabled { opacity: 0.5; cursor: not-allowed; }
    .page-info { font-weight: 600; color: #34495e; font-size: 15px; }

    /* Styles pour les alertes de stock bas */
    .low-stock { background-color: #fff3cd !important; }
    .low-stock:hover { background-color: #ffe8a1 !important; }
    .badge-low {
      background: #e74c3c;
      color: white;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: bold;
      margin-left: 8px;
    }
  `]
})
export class ArticleListComponent implements OnInit {
  articles: Article[] = [];
  loading = true;
  
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;
  searchQuery = '';

  constructor(
    private articleService: ArticleService,
    public authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles(): void {
    this.loading = true;
    this.articleService.getAll(this.currentPage, this.pageSize, this.searchQuery).subscribe({
      next: (response) => {
        this.articles = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement articles', err);
        this.toastr.error('Erreur lors du chargement des articles', 'Erreur');
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadArticles();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadArticles();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadArticles();
    }
  }

  exportToCsv(): void {
    if (!this.articles || this.articles.length === 0) {
      this.toastr.warning('Aucun article à exporter', 'Attention');
      return;
    }

    const headers = ['Référence', 'Désignation', 'Catégorie', 'Stock Physique', 'Stock Réservé', 'Stock Disponible'];
    const rows = this.articles.map(a => [
      a.reference,
      `"${a.designation}"`,
      a.category,
      a.currentStockPhysical,
      a.currentStockReserved,
      (a.currentStockPhysical - a.currentStockReserved)
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(e => e.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'sunushop_articles.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.toastr.success('Fichier Excel/CSV téléchargé !', 'Succès');
  }
}