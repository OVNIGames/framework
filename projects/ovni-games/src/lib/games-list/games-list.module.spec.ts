import { GamesListModule } from './games-list.module';

describe('GamesListModule', () => {
  let gamesListModule: GamesListModule;

  beforeEach(() => {
    gamesListModule = new GamesListModule();
  });

  it('should create an instance', () => {
    expect(gamesListModule).toBeTruthy();
  });
});
