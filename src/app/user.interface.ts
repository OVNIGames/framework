import { GameInterface } from './game.interface';

export interface UserInterface {
  name: string;
  games: GameInterface[];
  __typename: string;
}

export interface UsersQueryInterface {
  users: {
    data: UserInterface[];
    __typename: string;
  };
}
