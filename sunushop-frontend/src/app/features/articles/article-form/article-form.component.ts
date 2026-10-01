import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ArticleService } from '../../../core/services/article.service';
import { Article } from '../../../shared/models/article.model';

@Component({
  selector: 'app-article-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="card">
        <h1>Nouvel article</h1>
        <p class="subtitle">Remplissez les informations de l'article</p>

        <form (ngSubmit)="onSubmit()" #form="ngForm">
          <div class="form-group">
            <label for="reference">Référence *</label>
            <input
              type="text"
              id="reference"
              name="reference"
              [(ngModel)]="article.reference"
              required
              placeholder="Ex: PP-A4-75G"
              #reference="ngModel"
              [class.invalid]="reference.invalid && reference.touched">
            <span class="error" *ngIf="reference.invalid && reference.touched">
              La référence est obligatoire
            </span>
          </div>

          <div class="form-group">
            <label for="designation">Désignation *</label>
            <input
              type="text"
              id="designation"
              name="designation"
              [(ngModel)]="article.designation"
              required
              placeholder="Ex: Papier A4 75g - Ramette 500 feuilles"
              #designation="ngModel"
              [class.invalid]="designation.invalid && designation.touched">
            <span class="error" *ngIf="designation.invalid && designation.touched">
              La désignation est obligatoire
            </span>
          </div>

          <div class="form-group">
            <label for="category">Catégorie</label>
            <select id="category" name="category" [(ngModel)]="article.category">
              <option value="">-- Choisir --</option>
              <option value="Papier">Papier</option>
              <option value="Cartouche">Cartouche</option>
              <option value="Fourniture">Fourniture</option>
              <option value="Mobilier">Mobilier</option>
            </select>
          </div>

          <div class="form-group">
            <label for="stock">Stock physique *</label>
            <input
              type="number"
              id="stock"
              name="stock"
              [(ngModel)]="article.currentStockPhysical"
              required
              min="0"
              placeholder="0"
              #stock="ngModel"
              [class.invalid]="stock.invalid && stock.touched">
            <span class="error" *ngIf="stock.invalid && stock.touched">
              Le stock est obligatoire (>= 0)
            </span>
          </div>

          <div class="alert success" *ngIf="successMessage">
            {{ successMessage }}
          </div>

          <div class="alert error" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <div class="actions">
            <a routerLink="/articles" class="btn btn-secondary">Annuler</a>
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="form.invalid || submitting">
              {{ submitting ? 'Création...' : 'Créer l article' }}
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
    input.invalid { border-color: #e74c3c; }
    .error { display: block; color: #e74c3c; font-size: 13px; margin-top: 6px; }
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
export class ArticleFormComponent {
  article: Article = {
    reference: '',
    designation: '',
    category: '',
    currentStockPhysical: 0,
    currentStockReserved: 0
  };

  submitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private articleService: ArticleService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.submitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.articleService.create(this.article).subscribe({
      next: (created) => {
        console.log('Article créé :', created);
        this.successMessage = 'Article ' + created.reference + ' créé avec succès !';
        this.submitting = false;

        setTimeout(() => {
          this.router.navigate(['/articles']);
        }, 1500);
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.errorMessage = 'Erreur : ' + (err.error?.message || err.message || 'Création impossible');
        this.submitting = false;
      }
    });
  }
}