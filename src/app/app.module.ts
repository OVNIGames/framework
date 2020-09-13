import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { SocketIoModule } from '@ovnigames/framework/lib/socket/socket-io.module';

import { GamesListModule } from '../../projects/ovni-games/src/lib/games-list/games-list.module';
import { GraphQLModule } from '../../projects/ovni-games/src/lib/graphql.module';
import { LoginModule } from '../../projects/ovni-games/src/lib/login/login.module';
import { RegisterModule } from '../../projects/ovni-games/src/lib/register/register.module';
import { SocketService } from '../../projects/ovni-games/src/lib/socket/socket.service';
import { UserModule } from '../../projects/ovni-games/src/lib/user/user.module';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

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

    SocketIoModule.forRoot({
      url: environment.socket_uri,
    }),
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
