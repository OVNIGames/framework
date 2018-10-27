import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameCreatorComponent } from './game-creator.component';
import {
  MatButtonModule,
  MatCardModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatSelectModule,
} from '@angular/material';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
  ],
  exports: [
    GameCreatorComponent,
  ],
  declarations: [
    GameCreatorComponent,
  ],
})
export class GameCreatorModule {
}
