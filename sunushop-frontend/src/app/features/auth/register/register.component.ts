import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, RegisterRequest } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="register-container">
      <div class="register-card">
        <div class="logo">
          <h1>SunuShop Stock</h1>
          <p class="subtitle">Gestion de stock multi-entrepots</p>
        </div>

        <h2>Creer un compte</h2>
        <p class="hint">Inscrivez-vous pour acceder a l'application</p>

        <form (ngSubmit)="onSubmit()" #form="ngForm">
          <div class="form-group">
            <label for="username">Nom d'utilisateur *</label>
            <input
              type="text"
              id="username"
              name="username"
              [(ngModel)]="request.username"
              required
              minlength="3"
              autocomplete="username"
              placeholder="Choisissez un nom"
              [disabled]="loading">
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="request.email"
              autocomplete="email"
              placeholder="votre@email.com"
              [disabled]="loading">
          </div>

          <div class="form-group">
            <label for="password">Mot de passe *</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="request.password"
              required
              minlength="6"
              autocomplete="new-password"
              placeholder="Minimum 6 caracteres"
              [disabled]="loading">
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirmer le mot de passe *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              [(ngModel)]="confirmPassword"
              required
              autocomplete="new-password"
              placeholder="Retapez le mot de passe"
              [disabled]="loading">
            <small class="error-hint" *ngIf="confirmPassword && request.password !== confirmPassword">
              Les mots de passe ne correspondent pas
            </small>
          </div>

          <div class="alert error" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <div class="alert success" *ngIf="successMessage">
            {{ successMessage }}
          </div>

          <button
            type="submit"
            class="btn-primary"
            [disabled]="form.invalid || loading || request.password !== confirmPassword">
            {{ loading ? 'Inscription...' : 'Creer le compte' }}
          </button>
        </form>

        <div class="footer">
          <p>Deja un compte ?</p>
          <a routerLink="/login" class="link">Se connecter</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #2c3e50 0%, #27ae60 100%);
      padding: 20px;
    }
    .register-card {
      background: white;
      border-radius: 16px;
      padding: 50px;
      max-width: 450px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    .logo {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo h1 {
      color: #2c3e50;
      margin: 0;
      font-size: 28px;
    }
    .subtitle {
      color: #7f8c8d;
      margin: 5px 0 0 0;
      font-size: 14px;
    }
    h2 {
      color: #2c3e50;
      margin: 0 0 8px 0;
      font-size: 22px;
    }
    .hint {
      color: #7f8c8d;
      margin: 0 0 30px 0;
      font-size: 14px;
    }
    .form-group {
      margin-bottom: 20px;
    }
    label {
      display: block;
      color: #2c3e50;
      font-weight: 600;
      margin-bottom: 8px;
      font-size: 14px;
    }
    input {
      width: 100%;
      padding: 14px 16px;
      border: 2px solid #e0e6ed;
      border-radius: 8px;
      font-size: 15px;
      box-sizing: border-box;
      transition: border-color 0.2s;
    }
    input:focus {
      outline: none;
      border-color: #27ae60;
    }
    input:disabled {
      background: #f5f7fa;
      cursor: not-allowed;
    }
    .error-hint {
      color: #e74c3c;
      font-size: 12px;
      margin-top: 6px;
      display: block;
    }
    .alert {
      padding: 14px 18px;
      border-radius: 8px;
      margin-bottom: 20px;
      font-size: 14px;
    }
    .alert.error {
      background: #ffe6e6;
      color: #c0392b;
      border: 1px solid #f5c6cb;
    }
    .alert.success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }
    .btn-primary {
      width: 100%;
      padding: 14px;
      background: #27ae60;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-primary:hover:not(:disabled) {
      background: #229954;
    }
    .btn-primary:disabled {
      background: #bdc3c7;
      cursor: not-allowed;
    }
    .footer {
      text-align: center;
      margin-top: 25px;
      padding-top: 25px;
      border-top: 1px solid #ecf0f1;
    }
    .footer p {
      color: #7f8c8d;
      margin: 0 0 8px 0;
      font-size: 14px;
    }
    .link {
      color: #27ae60;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
    }
    .link:hover {
      text-decoration: underline;
    }
  `]
})
export class RegisterComponent {
  request: RegisterRequest = {
    username: '',
    password: '',
    email: ''
  };

  confirmPassword = '';
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.request.username || !this.request.password) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires';
      return;
    }

    if (this.request.password !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }

    if (this.request.password.length < 6) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 6 caracteres';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register(this.request).subscribe({
      next: (response) => {
        this.successMessage = `Compte cree avec succes ! Redirection...`;
        this.loading = false;
        setTimeout(() => this.router.navigate(['/articles']), 1500);
      },
      error: (err) => {
        console.error('Register error:', err);
        if (err.status === 400) {
          this.errorMessage = err.error?.message || 'Donnees invalides';
        } else if (err.status === 0) {
          this.errorMessage = 'Impossible de contacter le serveur';
        } else {
          this.errorMessage = err.error?.message || 'Erreur d\'inscription';
        }
        this.loading = false;
      }
    });
  }
}