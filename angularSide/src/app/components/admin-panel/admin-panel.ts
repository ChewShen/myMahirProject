import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Api } from '../../services/api';

@Component({
  selector: 'app-admin-panel',
  imports: [CommonModule],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css',
})
export class AdminPanel {
  allScores: any[] = [];
  isLoading = true;

  constructor(private api:Api, private cdr: ChangeDetectorRef){}

  ngOnInit() {
    this.api.getAllScores().subscribe({
      next : (res) => {
        this.allScores = res.data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Failed to laod scores",err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
  
}
