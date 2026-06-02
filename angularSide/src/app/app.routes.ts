import { Routes } from '@angular/router';
import { CourseViewer } from './components/course-viewer/course-viewer';
import { Dashboard } from './components/dashboard/dashboard';
import { Auth } from './components/auth/auth';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';


export const routes: Routes = [
  // 1. When the URL is empty (Homepage), load the Dashboard
  { path: 'login', component: Auth },
  { 
    path: 'dashboard',
    component: Dashboard,
    canActivate:[authGuard]
  },
  {
    path: 'course',
    component: CourseViewer,
    canActivate:[authGuard,adminGuard] 
  },

  { path: '',redirectTo: 'login', pathMatch: 'full' }, // Default to login

  { path: '**', redirectTo: 'login' },

];
