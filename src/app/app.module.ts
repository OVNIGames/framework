import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { SocketService } from './socket.service';
import { MatCheckboxModule, MatInputModule, MatProgressSpinnerModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginModule } from './login/login.module';
import { LoginComponent } from './login/login.component';

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
    FormsModule,

    MatCheckboxModule,
    MatInputModule,
    MatProgressSpinnerModule,

    LoginModule,
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