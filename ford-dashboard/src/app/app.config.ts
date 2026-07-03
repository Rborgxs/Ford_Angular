import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const API_BASE_URL = 'http://localhost:3001';

export const API_IMG = {
  ranger: `${API_BASE_URL}/img/ranger.png`,
  mustang: `${API_BASE_URL}/img/mustang.png`,
  territory: `${API_BASE_URL}/img/territory.png`,
  broncoSport: `${API_BASE_URL}/img/broncoSport.png`,
  fordLogo: `${API_BASE_URL}/img/ford.png`,
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient()
  ]
};