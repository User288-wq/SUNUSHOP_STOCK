import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService, UserDto } from '../../core/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <div class="header">
        <div>
          <h1>Gestion des utilisateurs</h1>
          <p class="subtitle">Total : {{ users.length }} utilisateur(s)</p>
        </div>
        <div class="actions">
          <a routerLink="/articles" class="btn-back">← Retour aux articles</a>
        </div>
      </div>

      <div *ngIf="loading" class="loading">Chargement...</div>

      <table *ngIf="!loading && users.length > 0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom d'utilisateur</th>
            <th>Email</th>
            <th>Rôle actuel</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let user of users">
            <td>#{{ user.id }}</td>
            <td><strong>{{ user.username }}</strong></td>
            <td>{{ user.email || 'Non renseigné' }}</td>
            <td>
              <span class="badge" [ngClass]="user.role === 'ADMIN' ? 'badge-admin' : 'badge-user'">
                {{ user.role }}
              </span>
            </td>
            <td class="actions-cell">
              <select [value]="user.role" (change)="onRoleChange(user, $event)" class="role-select" [disabled]="user.username === 'diaraf'">
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
              <button (click)="deleteUser(user)" class="btn-delete" [disabled]="user.username === 'diaraf'">
                🗑️ Supprimer
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <p *ngIf="!loading && users.length === 0" class="empty">Aucun utilisateur trouvé.</p>
    </div>
  `,
  styles: [`
    .container { padding: 30px; max-width: 1200px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    h1 { color: #2c3e50; margin: 0 0 5px 0; }
    .subtitle { color: #7f8c8d; margin: 0; }
    .btn-back { background: #34495e; color: white; padding: 10px 16px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 13px; }
    .btn-back:hover { background: #2c3e50; }
    .loading { text-align: center; padding: 40px; color: #3498db; font-size: 18px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden; }
    th { background: #3498db; color: white; padding: 15px; text-align: left; font-size: 14px; text-transform: uppercase; }
    td { padding: 15px; border-bottom: 1px solid #ecf0f1; vertical-align: middle; }
    tr:hover { background: #f8f9fa; }
    .badge { padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: bold; color: white; }
    .badge-admin { background: #e74c3c; }
    .badge-user { background: #3498db; }
    .actions-cell { display: flex; gap: 10px; align-items: center; }
    .role-select { padding: 6px; border-radius: 6px; border: 1px solid #ccc; font-weight: 600; }
    .btn-delete { background: #e74c3c; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-weight: 600; }
    .btn-delete:hover:not(:disabled) { background: #c0392b; }
    .btn-delete:disabled { background: #bdc3c7; cursor: not-allowed; }
    .empty { text-align: center; color: #95a5a6; padding: 60px; font-size: 16px; background: white; border-radius: 8px; margin-top: 20px; }
  `]
})
export class UserListComponent implements OnInit {
  users: UserDto[] = [];
  loading = true;

  constructor(
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Erreur lors du chargement des utilisateurs', 'Erreur');
        this.loading = false;
      }
    });
  }

  onRoleChange(user: UserDto, event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newRole = select.value;
    
    if (newRole === user.role) return;

    this.userService.updateRole(user.id, newRole).subscribe({
      next: (updatedUser) => {
        user.role = updatedUser.role;
        this.toastr.success(`Rôle de ${user.username} mis à jour en ${newRole}`, 'Succès');
      },
      error: (err) => {
        this.toastr.error('Erreur lors de la mise à jour du rôle', 'Erreur');
        select.value = user.role;
      }
    });
  }

  deleteUser(user: UserDto): void {
    if (!confirm(`Voulez-vous vraiment supprimer l'utilisateur ${user.username} ?`)) return;

    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.toastr.success('Utilisateur supprimé', 'Succès');
        this.loadUsers();
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Erreur lors de la suppression', 'Erreur');
      }
    });
  }
}