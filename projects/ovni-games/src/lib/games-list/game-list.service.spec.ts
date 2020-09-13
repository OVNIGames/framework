import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { ApolloModule } from 'apollo-angular';

import { GameCreatorModule } from '../game-creator/game-creator.module';
import { GameListService } from './game-list.service';
import { GraphQLModule } from '../graphql.module';

describe('GameListService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      ApolloModule,
      CommonModule,
      GraphQLModule,
      HttpClientModule,
      RouterModule,
      MatButtonModule,
      MatCardModule,
      MatProgressSpinnerModule,
      GameCreatorModule,
    ],
  }));

  it('should be created', () => {
    const service: GameListService = TestBed.inject(GameListService);
    expect(service).toBeTruthy();
  });
});
