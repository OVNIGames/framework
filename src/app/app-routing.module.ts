import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GamesListComponent } from './games-list/games-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/games', pathMatch: 'full' },
  { path: 'games', component: GamesListComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
  ],
  declarations: [],
})
export class AppRoutingModule {
}
