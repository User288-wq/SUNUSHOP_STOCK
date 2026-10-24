import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReservationService } from '../../../core/services/reservation.service';
import { ArticleService } from '../../../core/services/article.service';
import { Reservation } from '../../../shared/models/reservation.model';
import { Article } from '../../../shared/models/article.model';

@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <div class="header">
        <div>
          <h1>Reservations actives</h1>
          <p class="subtitle">Total : {{ reservations.length }} reservation(s)</p>
        </div>
        <div class="actions">
          <a routerLink="/reservations/new" class="btn-new">
            + Nouvelle reservation
          </a>
          <a routerLink="/articles" class="btn-secondary">
            Voir articles
          </a>
        </div>
      </div>

      <div *ngIf="loading" class="loading">Chargement...</div>

      <div class="alert success" *ngIf="successMessage">
        {{ successMessage }}
      </div>

      <div class="alert error" *ngIf="errorMessage">
        {{ errorMessage }}
      </div>

      <table *ngIf="!loading && reservations.length > 0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Article</th>
            <th>Client</th>
            <th>Quantite</th>
            <th>Entrepot</th>
            <th>Expire le</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let r of reservations">
            <td>#{{ r.id }}</td>
            <td><strong>{{ getArticleReference(r.articleId) }}</strong></td>
            <td>Client {{ r.clientId }}</td>
            <td>{{ r.quantity }}</td>
            <td>{{ r.warehouseCode }}</td>
            <td>
              <span [class.expired]="isExpiringSoon(r.expiresAt)">
                {{ formatDate(r.expiresAt) }}
              </span>
            </td>
            <td>
              <button class="btn-cancel" (click)="cancelReservation(r.id!)">
                Annuler
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <p *ngIf="!loading && reservations.length === 0" class="empty">
        Aucune reservation active
      </p>
    </div>
  `,
  styles: [`
    .container { padding: 30px; max-width: 1200px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    h1 { color: #2c3e50; margin: 0 0 5px 0; }
    .subtitle { color: #7f8c8d; margin: 0; }
    .actions { display: flex; gap: 10px; }
    .btn-new { background: #27ae60; color: white; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; }
    .btn-new:hover { background: #229954; }
    .btn-secondary { background: #95a5a6; color: white; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; }
    .btn-secondary:hover { background: #7f8c8d; }
    .loading { text-align: center; padding: 40px; color: #3498db; font-size: 18px; }
    .alert { padding: 14px 18px; border-radius: 8px; margin-bottom: 20px; font-size: 14px; }
    .alert.success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
    .alert.error { background: #ffe6e6; color: #c0392b; border: 1px solid #f5c6cb; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden; }
    th { background: #3498db; color: white; padding: 15px; text-align: left; font-size: 14px; text-transform: uppercase; }
    td { padding: 15px; border-bottom: 1px solid #ecf0f1; }
    tr:hover { background: #f8f9fa; }
    .expired { color: #e74c3c; font-weight: bold; }
    .btn-cancel { background: #e74c3c; color: white; padding: 8px 14px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 13px; }
    .btn-cancel:hover { background: #c0392b; }
    .empty { text-align: center; color: #95a5a6; padding: 60px; font-size: 16px; background: white; border-radius: 8px; margin-top: 20px; }
  `]
})
export class ReservationListComponent implements OnInit {
  reservations: Reservation[] = [];
  articles: Article[] = [];
  loading = true;
  successMessage = '';
  errorMessage = '';

  constructor(
    private reservationService: ReservationService,
    private articleService: ArticleService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;

    this.articleService.getAll().subscribe({
      next: (data) => { this.articles = data.content; }
    });

    this.reservationService.getActive().subscribe({
      next: (data) => {
        this.reservations = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur de chargement : ' + (err.message || err.status);
        this.loading = false;
      }
    });
  }

  getArticleReference(articleId: number): string {
    const article = this.articles.find(a => a.id === articleId);
    return article ? article.reference : 'Article #' + articleId;
  }

  formatDate(date?: string): string {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  isExpiringSoon(date?: string): boolean {
    if (!date) return false;
    const d = new Date(date);
    const now = new Date();
    const diff = d.getTime() - now.getTime();
    return diff < 6 * 60 * 60 * 1000; // < 6h
  }

  cancelReservation(id: number): void {
    if (!confirm('Voulez-vous vraiment annuler cette reservation ?')) {
      return;
    }

    this.reservationService.cancel(id).subscribe({
      next: () => {
        this.successMessage = 'Reservation #' + id + ' annulee avec succes';
        this.loadData();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.errorMessage = 'Erreur : ' + (err.error?.message || err.message);
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
  }
}
