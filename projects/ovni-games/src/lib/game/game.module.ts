import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GameComponent } from './game.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [
    GameComponent,
  ],
  declarations: [
    GameComponent,
  ],
})
export class GameModule {
}
