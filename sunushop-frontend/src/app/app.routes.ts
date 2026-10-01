import { Routes } from '@angular/router';
import { ArticleListComponent } from './features/articles/article-list/article-list.component';
import { ArticleFormComponent } from './features/articles/article-form/article-form.component';
import { MovementFormComponent } from './features/stocks/movement-form/movement-form.component';
import { ReservationListComponent } from './features/reservations/reservation-list/reservation-list.component';
import { ReservationFormComponent } from './features/reservations/reservation-form/reservation-form.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'articles', component: ArticleListComponent },
  { path: 'articles/new', component: ArticleFormComponent },
  { path: 'stocks/movement', component: MovementFormComponent },
  { path: 'reservations', component: ReservationListComponent },
  { path: 'reservations/new', component: ReservationFormComponent }
];