import { Routes } from '@angular/router';
import { CourseViewer } from './components/course-viewer/course-viewer';
import { Dashboard } from './components/dashboard/dashboard';

export const routes: Routes = [
    // 1. When the URL is empty (Homepage), load the Dashboard
  { path: '', component: Dashboard },
  
  // 2. When they click a course, load the Course Viewer
  { path: 'course', component: CourseViewer },
  
  // 3. If they type a random URL, send them back to the dashboard
  { path: '**', redirectTo: '' }
];
