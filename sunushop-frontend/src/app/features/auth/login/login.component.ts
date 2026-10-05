import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService, AuthRequest } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="logo">
          <h1>SunuShop Stock</h1>
          <p class="subtitle">Gestion de stock multi-entrepots</p>
        </div>

        <h2>Connexion</h2>
        <p class="hint">Connectez-vous pour acceder a l'application</p>

        <form (ngSubmit)="onSubmit()" #form="ngForm">
          <div class="form-group">
            <label for="username">Nom d'utilisateur</label>
            <input
              type="text"
              id="username"
              name="username"
              [(ngModel)]="credentials.username"
              required
              autocomplete="username"
              placeholder="admin"
              [disabled]="loading">
          </div>

          <div class="form-group">
            <label for="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="credentials.password"
              required
              autocomplete="current-password"
              placeholder="••••••••"
              [disabled]="loading">
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
            [disabled]="form.invalid || loading">
            {{ loading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>

        <div class="footer">
          <p>Pas encore de compte ?</p>
          <a routerLink="/register" class="link">Creer un compte</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
      padding: 20px;
    }
    .login-card {
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
      border-color: #3498db;
    }
    input:disabled {
      background: #f5f7fa;
      cursor: not-allowed;
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
      background: #3498db;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-primary:hover:not(:disabled) {
      background: #2980b9;
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
      color: #3498db;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
    }
    .link:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  credentials: AuthRequest = {
    username: '',
    password: ''
  };

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  onSubmit(): void {
    if (!this.credentials.username || !this.credentials.password) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.successMessage = `Bienvenue ${response.username} !`;
        this.loading = false;

        // Redirection
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/articles';
        setTimeout(() => this.router.navigate([returnUrl]), 800);
      },
      error: (err) => {
        console.error('Login error:', err);
        if (err.status === 401 || err.status === 403) {
          this.errorMessage = 'Nom d\'utilisateur ou mot de passe incorrect';
        } else if (err.status === 0) {
          this.errorMessage = 'Impossible de contacter le serveur';
        } else {
          this.errorMessage = err.error?.message || 'Erreur de connexion';
        }
        this.loading = false;
      }
    });
  }
}