import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GamesListComponent, GamesListModule } from 'ovni-games';

@NgModule({
  imports: [
    CommonModule,
    GamesListModule,
    RouterModule.forChild([
      {
        path: '',
        component: GamesListComponent,
      },
    ]),
  ],
})
export class GamesListLoaderModule {
}
