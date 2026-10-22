import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ArticleService } from '../../../core/services/article.service';
import { Article } from '../../../shared/models/article.model';
import { ToastrService } from 'ngx-toastr'; // <-- Ajouté

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

          <!-- Les div alert success et error ont été supprimées, Toastr les remplace -->

          <div class="actions">
            <a routerLink="/articles" class="btn btn-secondary">Annuler</a>
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="form.invalid || submitting">
              {{ submitting ? 'Création...' : "Créer l'article" }}
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

  constructor(
    private articleService: ArticleService,
    private router: Router,
    private toastr: ToastrService // <-- Injecté
  ) {}

  onSubmit(): void {
    this.submitting = true;

    this.articleService.create(this.article).subscribe({
      next: (created) => {
        // On remplace le successMessage par une bulle verte
        this.toastr.success(`Article ${created.reference} créé avec succès !`, 'Succès');
        this.submitting = false;

        setTimeout(() => {
          this.router.navigate(['/articles']);
        }, 1500);
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.submitting = false;

        // On regarde si l'erreur vient d'un doublon SQL (Status 500 ou 409)
        const errorMsg = JSON.stringify(err.error) || '';
        if (errorMsg.includes('duplicate key') || errorMsg.includes('existe deja')) {
          this.toastr.error('Cette référence existe déjà. Veuillez en choisir une autre.', 'Doublon');
        } else {
          // Pour les autres erreurs, on affiche le message du serveur
          this.toastr.error(err.error?.message || 'Erreur lors de la création', 'Erreur');
        }
      }
    });
  }
}