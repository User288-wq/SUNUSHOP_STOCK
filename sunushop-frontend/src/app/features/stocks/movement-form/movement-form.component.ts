import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ArticleService } from '../../../core/services/article.service';
import { StockService } from '../../../core/services/stock.service';
import { Article } from '../../../shared/models/article.model';
import { MovementRequest, MovementResponse } from '../../../shared/models/movement.model';

@Component({
  selector: 'app-movement-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="card">
        <h1>Nouveau mouvement de stock</h1>
        <p class="subtitle">Enregistrer une entrée ou une sortie</p>

        <form (ngSubmit)="onSubmit()" #form="ngForm">
          <div class="form-group">
            <label for="articleId">Article *</label>
            <select
              id="articleId"
              name="articleId"
              [(ngModel)]="request.articleId"
              required
              #articleId="ngModel"
              [class.invalid]="articleId.invalid && articleId.touched">
              <option [ngValue]="0">-- Choisir un article --</option>
              <option *ngFor="let article of articles" [ngValue]="article.id">
                {{ article.reference }} - {{ article.designation }}
                (stock : {{ article.currentStockPhysical }})
              </option>
            </select>
            <span class="error" *ngIf="articleId.invalid && articleId.touched">
              L'article est obligatoire
            </span>
          </div>

          <div class="form-group">
            <label for="movementType">Type de mouvement *</label>
            <select
              id="movementType"
              name="movementType"
              [(ngModel)]="request.movementType"
              required>
              <option value="RECEPTION">Réception (entrée)</option>
              <option value="SORTIE">Sortie (vente)</option>
              <option value="AJUSTEMENT">Ajustement (inventaire)</option>
            </select>
          </div>

          <div class="form-group">
            <label for="warehouseCode">Entrepôt *</label>
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

          <div class="form-group">
            <label for="quantity">Quantité *</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              [(ngModel)]="request.quantity"
              required
              placeholder="0"
              #quantity="ngModel"
              [class.invalid]="quantity.invalid && quantity.touched">
            <small class="hint">
              Réception : quantité positive | Sortie : quantité négative
            </small>
          </div>

          <div class="form-group">
            <label for="reference">Référence document</label>
            <input
              type="text"
              id="reference"
              name="reference"
              [(ngModel)]="request.reference"
              placeholder="Ex: BL-2025-001 ou CMD-2025-042">
          </div>

          <div class="form-group">
            <label for="reason">Motif</label>
            <input
              type="text"
              id="reason"
              name="reason"
              [(ngModel)]="request.reason"
              placeholder="Ex: Réception fournisseur, Vente client...">
          </div>

          <div class="alert success" *ngIf="successMessage">
            {{ successMessage }}
          </div>

          <div class="alert error" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <div class="alert info" *ngIf="movementResult">
            <strong>Détails du mouvement :</strong><br>
            Stock physique : {{ movementResult.stockPhysical }}<br>
            Stock réservé : {{ movementResult.stockReserved }}<br>
            Stock disponible : {{ movementResult.stockAvailable }}
          </div>

          <div class="actions">
            <a routerLink="/articles" class="btn btn-secondary">Annuler</a>
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="form.invalid || submitting">
              {{ submitting ? 'Enregistrement...' : 'Enregistrer le mouvement' }}
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
    input.invalid, select.invalid { border-color: #e74c3c; }
    .error { display: block; color: #e74c3c; font-size: 13px; margin-top: 6px; }
    .hint { display: block; color: #95a5a6; font-size: 12px; margin-top: 6px; }
    .alert { padding: 14px 18px; border-radius: 8px; margin-bottom: 20px; font-size: 14px; }
    .alert.success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
    .alert.error { background: #ffe6e6; color: #c0392b; border: 1px solid #f5c6cb; }
    .alert.info { background: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb; }
    .actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ecf0f1; }
    .btn { padding: 12px 24px; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; text-decoration: none; border: none; display: inline-block; }
    .btn-primary { background: #3498db; color: white; }
    .btn-primary:hover:not(:disabled) { background: #2980b9; }
    .btn-primary:disabled { background: #bdc3c7; cursor: not-allowed; }
    .btn-secondary { background: #ecf0f1; color: #2c3e50; }
    .btn-secondary:hover { background: #d5dbdb; }
  `]
})
export class MovementFormComponent implements OnInit {
  articles: Article[] = [];
  request: MovementRequest = {
    articleId: 0,
    warehouseCode: 'DAK',
    quantity: 0,
    movementType: 'RECEPTION',
    reference: '',
    reason: ''
  };

  submitting = false;
  successMessage = '';
  errorMessage = '';
  movementResult: MovementResponse | null = null;

  constructor(
    private articleService: ArticleService,
    private stockService: StockService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.articleService.getAll().subscribe({
      next: (data) => {
        this.articles = data.content;
        console.log('Articles charges pour le formulaire:', data);
      },
      error: (err) => {
        console.error('Erreur chargement articles:', err);
        this.errorMessage = 'Impossible de charger les articles';
      }
    });
  }

  onSubmit(): void {
    this.submitting = true;
    this.successMessage = '';
    this.errorMessage = '';
    this.movementResult = null;

    // Ajustement de la quantité selon le type
    const finalRequest = { ...this.request };
    if (finalRequest.movementType === 'SORTIE' && finalRequest.quantity > 0) {
      finalRequest.quantity = -finalRequest.quantity;
    }
    if (finalRequest.movementType === 'RECEPTION' && finalRequest.quantity < 0) {
      finalRequest.quantity = Math.abs(finalRequest.quantity);
    }

    this.stockService.recordMovement(finalRequest).subscribe({
      next: (result) => {
        console.log('Mouvement enregistre:', result);
        this.movementResult = result;
        this.successMessage = 'Mouvement enregistre avec succes !';
        this.submitting = false;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.errorMessage = 'Erreur : ' + (err.error?.message || err.message || 'Operation impossible');
        this.submitting = false;
      }
    });
  }
}
