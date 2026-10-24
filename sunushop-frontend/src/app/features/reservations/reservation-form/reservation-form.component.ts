import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ReservationService } from '../../../core/services/reservation.service';
import { ArticleService } from '../../../core/services/article.service';
import { Article } from '../../../shared/models/article.model';
import { ReservationRequest } from '../../../shared/models/reservation.model';

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="card">
        <h1>Nouvelle reservation</h1>
        <p class="subtitle">Reserver du stock pour un client Premium (48h)</p>

        <form (ngSubmit)="onSubmit()" #form="ngForm">
          <div class="form-group">
            <label for="articleId">Article *</label>
            <select
              id="articleId"
              name="articleId"
              [(ngModel)]="request.articleId"
              required
              #articleId="ngModel">
              <option [ngValue]="0">-- Choisir un article --</option>
              <option *ngFor="let a of articles" [ngValue]="a.id">
                {{ a.reference }} - {{ a.designation }}
                (disponible : {{ a.currentStockPhysical - a.currentStockReserved }})
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="clientId">ID Client *</label>
            <input
              type="number"
              id="clientId"
              name="clientId"
              [(ngModel)]="request.clientId"
              required
              min="1"
              placeholder="Ex: 100">
          </div>

          <div class="form-group">
            <label for="quantity">Quantite *</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              [(ngModel)]="request.quantity"
              required
              min="1"
              placeholder="0">
            <small class="hint">Max 30% du stock physique de l'article</small>
          </div>

          <div class="form-group">
            <label for="warehouseCode">Entrepot *</label>
            <select
              id="warehouseCode"
              name="warehouseCode"
              [(ngModel)]="request.warehouseCode"
              required>
              <option value="DAK">Dakar</option>
              <option value="CAS">Casablanca</option>
              <option value="ABI">Abidjan</option>
            </select>
          </div>

          <div class="alert success" *ngIf="successMessage">
            {{ successMessage }}
          </div>

          <div class="alert error" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <div class="actions">
            <a routerLink="/reservations" class="btn btn-secondary">Annuler</a>
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="form.invalid || submitting">
              {{ submitting ? 'Creation...' : 'Creer la reservation' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 30px; max-width: 700px; margin: 0 auto; }
    .card { background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    h1 { color: #2c3e50; margin: 0 0 8px 0; }
    .subtitle { color: #7f8c8d; margin: 0 0 30px 0; }
    .form-group { margin-bottom: 24px; }
    label { display: block; color: #2c3e50; font-weight: 600; margin-bottom: 8px; font-size: 14px; }
    input, select { width: 100%; padding: 12px 16px; border: 2px solid #e0e6ed; border-radius: 8px; font-size: 15px; box-sizing: border-box; font-family: inherit; }
    input:focus, select:focus { outline: none; border-color: #3498db; }
    .hint { display: block; color: #95a5a6; font-size: 12px; margin-top: 6px; }
    .alert { padding: 14px 18px; border-radius: 8px; margin-bottom: 20px; font-size: 14px; }
    .alert.success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
    .alert.error { background: #ffe6e6; color: #c0392b; border: 1px solid #f5c6cb; }
    .actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ecf0f1; }
    .btn { padding: 12px 24px; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; text-decoration: none; border: none; display: inline-block; }
    .btn-primary { background: #3498db; color: white; }
    .btn-primary:hover:not(:disabled) { background: #2980b9; }
    .btn-primary:disabled { background: #bdc3c7; cursor: not-allowed; }
    .btn-secondary { background: #ecf0f1; color: #2c3e50; }
    .btn-secondary:hover { background: #d5dbdb; }
  `]
})
export class ReservationFormComponent implements OnInit {
  articles: Article[] = [];
  request: ReservationRequest = {
    articleId: 0,
    clientId: 0,
    quantity: 0,
    warehouseCode: 'DAK'
  };

  submitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private reservationService: ReservationService,
    private articleService: ArticleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.articleService.getAll().subscribe({
      next: (data) => { this.articles = data.content; },
      error: (err) => { this.errorMessage = 'Impossible de charger les articles'; }
    });
  }

  onSubmit(): void {
    this.submitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.reservationService.create(this.request).subscribe({
      next: (result) => {
        this.successMessage = 'Reservation #' + result.id + ' creee avec succes !';
        this.submitting = false;
        setTimeout(() => this.router.navigate(['/reservations']), 1500);
      },
      error: (err) => {
        this.errorMessage = 'Erreur : ' + (err.error?.message || err.message);
        this.submitting = false;
      }
    });
  }
}
