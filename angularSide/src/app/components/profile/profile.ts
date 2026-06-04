import { ChangeDetectorRef, Component } from '@angular/core';
import { Data } from '../../services/data';
import { Api } from '../../services/api';
import { CommonModule, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [UpperCasePipe,CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  myScores: any[] = [];
  user: any = null;
  isLoading = true;

  constructor (
    private data : Data,
    private cdr: ChangeDetectorRef,
    private api: Api) {}

    ngOnInit(){
      this.user = this.data.loadStorage('user_detail');

      this.api.getMyScores().subscribe({
        next : (res) => {
          this.myScores = res.data;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error("Failed to load profile scores", err);
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    }
}
