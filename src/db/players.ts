import { Player } from '../model/player';

const players: Player[] = [];

export interface IPlayersRepository {
  getPlayers(): Player[];
  getPlayerById(index: string): Player | undefined;
  addPlayer(data: Player): Omit<Player, 'password'>;
  deletePlayer(index: string): void;
}

class PlayersRepository implements IPlayersRepository {
  players;
  constructor(players: Player[]) {
    this.players = players;
  }

  getPlayers() {
    return this.players;
  }

  getPlayerById(index: string) {
    return this.players.find((player) => player.index === index);
  }

  addPlayer(data: Player) {
    const player = {
      name: data.name,
      password: data.password,
      index: data.index,
    };
    this.players.push(player);
    return { name: player.name, index: player.index };
  }

  deletePlayer(index: string) {
    const playerIndex = this.players.findIndex(
      (player) => player.index === index,
    );
    this.players.splice(playerIndex, 1);
  }
}

export const playersRepository = new PlayersRepository(players);
