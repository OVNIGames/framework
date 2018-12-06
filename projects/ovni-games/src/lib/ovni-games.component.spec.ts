import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OvniGamesComponent } from './ovni-games.component';

describe('OvniGamesComponent', () => {
  let component: OvniGamesComponent;
  let fixture: ComponentFixture<OvniGamesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OvniGamesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OvniGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
