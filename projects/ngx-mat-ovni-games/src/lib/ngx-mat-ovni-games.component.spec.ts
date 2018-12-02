import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxMatOvniGamesComponent } from './ngx-mat-ovni-games.component';

describe('NgxMatOvniGamesComponent', () => {
  let component: NgxMatOvniGamesComponent;
  let fixture: ComponentFixture<NgxMatOvniGamesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxMatOvniGamesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxMatOvniGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
