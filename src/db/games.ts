import { v4 as generateId } from 'uuid';
import { Room, RoomUser } from '../model/room';
import { Game, Ship } from '../model/game';

const games: Game[] = [];

class GamesRepository {
  games: Game[];

  constructor(games: Game[]) {
    this.games = games;
  }

  getGameById(gameId: string) {
    return this.games.find(g => g.gameId === gameId);
  }

  createGame(players: string[]) {
    const game: Game = {
      gameId: generateId(),
      players: players.map(p => ({
        playerId: p,
        ships: []
      })),
      currentTurn: undefined
    };

    this.games.push(game);
    return game;
  }

  addShips(gameId: string, playerId: string, ships: Ship[]) {
    const game = this.getGameById(gameId);
    if (!game) return false;

    const player = game.players.find(p => p.playerId === playerId);
    if (!player) return false;

    player.ships = ships;
    return game;
  }

  isGameReady(gameId: string) {
    const game = this.getGameById(gameId);
    if (!game) return false;

    return game.players.every(p => p.ships && p.ships.length > 0);
  }

  getRandomTurn(gameId: string) {
    const game = this.getGameById(gameId);
    if (!game) return;

    const randomIndex = Math.floor(Math.random() * game.players.length);
    game.currentTurn = game.players[randomIndex]?.playerId;

    return game.currentTurn;
  }

  getCurrentTurn(gameId: string) {
    return this.getGameById(gameId)?.currentTurn;
  }

  setCurrentTurn(gameId: string, playerId: string) {
    const game = this.getGameById(gameId);
    if (!game) return false;

    game.currentTurn = playerId;
    return true;
  }
}

export const gamesRepository = new GamesRepository(games);
