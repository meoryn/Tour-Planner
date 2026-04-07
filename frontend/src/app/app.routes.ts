import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./home/home').then(m => m.HomeComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('./login/login').then(m => m.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./register/register').then(m => m.RegisterComponent)
    },
    {
        path: 'tour/:id/edit',
        loadComponent: () => import('./edit-tour/edit-tour').then(m => m.EditTourComponent)
    },
    {
        path: 'tour/add',
        loadComponent: () => import('./add-tour/add-tour').then(m => m.AddTourComponent)
    }
];
