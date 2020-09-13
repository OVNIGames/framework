import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { ApolloModule } from 'apollo-angular';

import { GraphQLModule } from '../graphql.module';
import { GamesListComponent } from './games-list.component';
import { GameCreatorModule } from '../game-creator/game-creator.module';

describe('GamesListComponent', () => {
  let component: GamesListComponent;
  let fixture: ComponentFixture<GamesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ApolloModule,
        CommonModule,
        GraphQLModule,
        HttpClientTestingModule,
        RouterModule,
        MatButtonModule,
        MatCardModule,
        MatProgressSpinnerModule,
        GameCreatorModule,
      ],
      declarations: [ GamesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
