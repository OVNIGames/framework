import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { SocketService } from './socket.service';
import { MatProgressSpinnerModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginModule } from './login/login.module';
import { UserModule } from './user/user.module';
import { RegisterModule } from './register/register.module';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { GamesListModule } from './games-list/games-list.module';

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
