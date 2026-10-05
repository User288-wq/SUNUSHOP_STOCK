import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, CurrentUser } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <header>
      <div class="header-content">
        <div class="brand">
          <h1>SunuShop Stock</h1>
          <p>Gestion de stocks multi-entrepots</p>
        </div>

        <nav *ngIf="currentUser$ | async as user">
          <a routerLink="/articles" routerLinkActive="active">Articles</a>
          <a routerLink="/stocks/movement" routerLinkActive="active">Mouvement</a>
          <a routerLink="/reservations" routerLinkActive="active">Reservations</a>
          
          <div class="user-info">
            <span class="username">{{ user.username }}</span>
            <span class="role">{{ user.role }}</span>
            <button class="btn-logout" (click)="logout()">Deconnexion</button>
          </div>
        </nav>
      </div>
    </header>

    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    header {
      background: linear-gradient(135deg, #2c3e50, #3498db);
      color: white;
      padding: 0;
      box-shadow: 0 2px 10px rgba(0,0,0,0.15);
    }
    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
    }
    .brand h1 { margin: 0; font-size: 24px; letter-spacing: 1px; }
    .brand p { margin: 4px 0 0 0; opacity: 0.9; font-size: 13px; }

    nav {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    nav a {
      color: white;
      text-decoration: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      transition: background 0.2s;
    }
    nav a:hover { background: rgba(255,255,255,0.1); }
    nav a.active { background: rgba(255,255,255,0.2); font-weight: 600; }

    .user-info {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-left: 16px;
      padding-left: 16px;
      border-left: 1px solid rgba(255,255,255,0.3);
    }
    .username { font-weight: 600; font-size: 14px; }
    .role {
      background: rgba(255,255,255,0.2);
      padding: 3px 8px;
      border-radius: 10px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .btn-logout {
      background: #e74c3c;
      color: white;
      border: none;
      padding: 8px 14px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-logout:hover { background: #c0392b; }

    main { min-height: calc(100vh - 90px); background: #f0f2f5; }
  `]
})
export class AppComponent {
  currentUser$;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  logout(): void {
    if (!confirm('Voulez-vous vraiment vous deconnecter ?')) return;
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}