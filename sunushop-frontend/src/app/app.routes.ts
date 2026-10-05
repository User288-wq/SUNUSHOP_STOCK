import { Routes } from '@angular/router';
import { ArticleListComponent } from './features/articles/article-list/article-list.component';
import { ArticleFormComponent } from './features/articles/article-form/article-form.component';
import { MovementFormComponent } from './features/stocks/movement-form/movement-form.component';
import { ReservationListComponent } from './features/reservations/reservation-list/reservation-list.component';
import { ReservationFormComponent } from './features/reservations/reservation-form/reservation-form.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Routes publiques
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Routes protegees
  { path: '', redirectTo: 'articles', pathMatch: 'full' },
  { path: 'articles', component: ArticleListComponent, canActivate: [authGuard] },
  { path: 'articles/new', component: ArticleFormComponent, canActivate: [authGuard] },
  { path: 'stocks/movement', component: MovementFormComponent, canActivate: [authGuard] },
  { path: 'reservations', component: ReservationListComponent, canActivate: [authGuard] },
  { path: 'reservations/new', component: ReservationFormComponent, canActivate: [authGuard] },

  // Fallback
  { path: '**', redirectTo: 'articles' }
];