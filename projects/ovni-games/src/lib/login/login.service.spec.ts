import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ApolloModule } from 'apollo-angular';

import { GraphQLModule } from '../graphql.module';
import { LoginService } from './login.service';

describe('LoginService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      ApolloModule,
      CommonModule,
      GraphQLModule,
      HttpClientModule,
    ],
  }));

  it('should be created', () => {
    const service: LoginService = TestBed.inject(LoginService);
    expect(service).toBeTruthy();
  });
});
