import { Routes } from '@angular/router';
import { CourseViewer } from './components/course-viewer/course-viewer';
import { Dashboard } from './components/dashboard/dashboard';
import { Auth } from './components/auth/auth';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';
import { AdminPanel } from './components/admin-panel/admin-panel';
import { Profile } from './components/profile/profile';


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
    canActivate:[authGuard] 
  },
  { 
    path: 'admin-panel', 
    component: AdminPanel, 
    canActivate: [authGuard, adminGuard] 
  },
  { 
    path: 'course/:id', // The colon (:) means 'id' is a dynamic variable!
    component: CourseViewer, 
    canActivate: [authGuard] 
  },
  { 
    path: 'profile', 
    component: Profile, 
    canActivate: [authGuard] // 🔒 Must be logged in!
  },

  { path: '',redirectTo: 'login', pathMatch: 'full' }, // Default to login

  { path: '**', redirectTo: 'login' },

];
