import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(c => c.LoginComponent),
    canActivate: [NoAuthGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(c => c.RegisterComponent),
    canActivate: [NoAuthGuard]
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/forgot-password/forgot-password.component').then(c => c.ForgotPasswordComponent),
    canActivate: [NoAuthGuard]
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home-page/home-page.component').then(c => c.HomePageComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'nueva-tarea',
    loadComponent: () => import('./pages/nueva-tarea/nueva-tarea.component').then(c => c.NuevaTareaComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
