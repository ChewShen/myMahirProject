import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggle } from '@angular/material/button-toggle';

@NgModule({
  declarations: [MatCardModule,MatButtonModule],
  imports: [CommonModule],
})

export class SharedModule {}
