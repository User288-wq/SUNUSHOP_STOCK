import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { RegisterComponent } from './register.component';
import { provideToastr } from 'ngx-toastr'; // <-- Ajouté pour les tests
import { provideAnimations } from '@angular/platform-browser/animations'; // <-- Ajouté pour les tests

describe('RegisterComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideToastr(), // <-- Requis
        provideAnimations() // <-- Requis
      ]
    }).compileComponents();
  });

  it('devrait creer le composant', () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('devrait afficher le titre Creer un compte', () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Creer un compte');
  });

  it('devrait avoir un request vide initialement', () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    const component = fixture.componentInstance;
    expect(component.request.username).toBe('');
    expect(component.request.password).toBe('');
  });
});
