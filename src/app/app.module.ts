import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { SocketService } from '../../projects/ngx-mat-ovni-games/src/lib/socket.service';
import { MatProgressSpinnerModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginModule } from '../../projects/ngx-mat-ovni-games/src/lib/login/login.module';
import { UserModule } from '../../projects/ngx-mat-ovni-games/src/lib/user/user.module';
import { RegisterModule } from '../../projects/ngx-mat-ovni-games/src/lib/register/register.module';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { GamesListModule } from '../../projects/ngx-mat-ovni-games/src/lib/games-list/games-list.module';
import { GraphQLModule } from '../../projects/ngx-mat-ovni-games/src/lib/graphql.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    GraphQLModule,
    HttpClientModule,
    RouterModule,

    MatProgressSpinnerModule,

    UserModule,
    GamesListModule,

    LoginModule,
    RegisterModule,
    AppRoutingModule,
  ],
  providers: [
    SocketService,
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule {
}
