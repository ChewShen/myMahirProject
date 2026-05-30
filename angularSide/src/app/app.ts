import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CourseViewer } from './components/course-viewer/course-viewer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,CourseViewer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angularSide');
}
