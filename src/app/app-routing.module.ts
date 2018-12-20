import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/games', pathMatch: 'full' },
  { path: 'play/:id/:code', loadChildren: './game/loader.module#GameLoaderModule' },
  { path: 'games', loadChildren: './games-list/loader.module#GamesListLoaderModule' },
  { path: 'doc', loadChildren: './doc/loader.module#DocLoaderModule' },
  { path: 'doc/:path/:name', loadChildren: './doc/loader.module#DocLoaderModule' },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules}),
  ],
  declarations: [],
})
export class AppRoutingModule {
}
