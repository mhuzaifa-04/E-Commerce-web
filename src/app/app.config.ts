import { ApplicationConfig } from '@angular/core';
import { provideZonelessChangeDetection } from '@angular/core'; // <-- Add this
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http'; // <-- Import these
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch()), // <-- withFetch optimization boosts performance under SSR!
    provideClientHydration()
  ]
};