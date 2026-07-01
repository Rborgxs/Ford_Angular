import { Routes } from '@angular/router';
import { authGuard } from './guards/auth';

export const routes: Routes = [
	{
		path: '',
		redirectTo: 'login',
		pathMatch: 'full'
	},
	{
		path: 'login',
		loadComponent: () => import('./components/pages/login/login').then(m => m.LoginComponent)
	},
	{
		path: 'home',
		canActivate: [authGuard],
		loadComponent: () => import('./components/pages/home/home').then(m => m.HomeComponent)
	},
	{
		path: 'dashboard',
		canActivate: [authGuard],
		loadComponent: () => import('./components/pages/dashboard/dashboard').then(m => m.DashboardComponent)
	},
	{
		path: '**',
		redirectTo: 'login'
	}
];