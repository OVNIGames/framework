import { TestBed } from '@angular/core/testing';

import { NgxMatOvniGamesService } from './ngx-mat-ovni-games.service';

describe('NgxMatOvniGamesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgxMatOvniGamesService = TestBed.get(NgxMatOvniGamesService);
    expect(service).toBeTruthy();
  });
});
