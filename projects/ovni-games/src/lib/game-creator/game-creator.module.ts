import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatInputModule, MatProgressSpinnerModule, MatSelectModule } from '@angular/material';
import { GameCreatorComponent } from './game-creator.component';

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
