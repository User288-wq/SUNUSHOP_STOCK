import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    provideAnimations(), // Obligatoire pour les animations de Toastr
    provideToastr({
      timeOut: 3000, // Disparaît après 3 secondes
      positionClass: 'toast-top-right', // En haut à droite
      preventDuplicates: true,
    })
  ]
};
