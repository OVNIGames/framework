import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApolloModule } from 'apollo-angular';

import { GraphQLModule } from '../graphql.module';
import { RegisterService } from './register.service';

describe('RegisterService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      ApolloModule,
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      HttpClientModule,
      GraphQLModule,

      MatButtonModule,
      MatCardModule,
      MatCheckboxModule,
      MatInputModule,
      MatProgressSpinnerModule,
    ],
  }));

  it('should be created', () => {
    const service: RegisterService = TestBed.inject(RegisterService);
    expect(service).toBeTruthy();
  });
});
