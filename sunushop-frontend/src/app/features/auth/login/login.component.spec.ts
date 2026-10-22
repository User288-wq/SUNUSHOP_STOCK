import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { LoginComponent } from './login.component';
import { provideToastr } from 'ngx-toastr'; // <-- Ajouté
import { provideAnimations } from '@angular/platform-browser/animations'; // <-- Ajouté

describe('LoginComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideToastr(), // <-- Requis pour les tests
        provideAnimations() // <-- Requis pour les tests
      ]
    }).compileComponents();
  });

  it('devrait creer le composant', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('devrait afficher le titre Connexion', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Connexion');
  });

  it('devrait avoir des credentials vides initialement', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    expect(component.credentials.username).toBe('');
    expect(component.credentials.password).toBe('');
  });
});
