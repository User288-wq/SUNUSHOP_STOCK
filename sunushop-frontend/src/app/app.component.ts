import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <header>
      <h1>SunuShop Stock</h1>
      <p>Gestion de stocks multi-entrepôts</p>
    </header>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    header {
      background: linear-gradient(135deg, #2c3e50, #3498db);
      color: white;
      padding: 30px;
      text-align: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.15);
    }
    header h1 { margin: 0; font-size: 28px; letter-spacing: 1px; }
    header p { margin: 8px 0 0 0; opacity: 0.9; font-size: 14px; }
    main { min-height: calc(100vh - 130px); background: #f0f2f5; }
  `]
})
export class AppComponent {}