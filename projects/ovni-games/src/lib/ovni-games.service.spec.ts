import { TestBed } from '@angular/core/testing';

import { OvniGamesService } from './ovni-games.service';

describe('OvniGamesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OvniGamesService = TestBed.get(OvniGamesService);
    expect(service).toBeTruthy();
  });
});
