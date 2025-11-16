import { v4 as generateId } from 'uuid';
import { Game, Ship } from '../model/game';

const games: Game[] = [];

class GamesRepository {
  games: Game[];

  constructor(games: Game[]) {
    this.games = games;
  }

  getGameById(gameId: string) {
    return this.games.find((g) => g.gameId === gameId);
  }

  createGame(players: string[]) {
    const game: Game = {
      gameId: generateId(),
      players: players.map((p) => ({
        playerId: p,
        ships: [],
      })),
      currentTurn: undefined,
    };

    this.games.push(game);
    return game;
  }

  addShips(gameId: string, playerId: string, ships: Ship[]) {
    const game = this.getGameById(gameId);
    if (!game) return false;

    const player = game.players.find((p) => p.playerId === playerId);
    if (!player) return false;

    player.ships = ships;
    ships.forEach((ship) => {
      const { length, direction } = ship;
      ship.cells = [];
      for (let i = 0; i < length; i++) {
        if (direction) {
          ship.cells.push({ x: ship.position.x, y: ship.position.y + i });
        } else {
          ship.cells.push({ x: ship.position.x + i, y: ship.position.y });
        }
      }

      ship.hits = [];
    });
    return game;
  }

  isGameReady(gameId: string) {
    const game = this.getGameById(gameId);
    if (!game) return false;

    return game.players.every((p) => p.ships && p.ships.length > 0);
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

  // randomAttack(gameId: string, playerId: string) {}

  attack(gameId: string, playerId: string, x: number, y: number) {
    const game = this.getGameById(gameId);

    if (!game) return;
    if (game.currentTurn !== playerId) return;

    const current = game.players.find((p) => p.playerId === playerId);
    const enemy = game.players.find((p) => p.playerId !== playerId);

    if (!current || !enemy) return;
    if (!enemy || !enemy.ships) return;

    let status: 'miss' | 'shot' | 'killed' = 'miss';
    const misses: { x: number; y: number }[] = [];

    for (const ship of enemy.ships) {
      const hitIndex = ship.cells.findIndex(
        (cell) => cell.x === x && cell.y === y,
      );
      if (hitIndex !== -1) {
        ship.hits.push({ x, y });
        if (ship.hits.length === ship.cells.length) {
          status = 'killed';

          ship.cells.forEach((cell) => {
            for (let dx = -1; dx <= 1; dx++) {
              for (let dy = -1; dy <= 1; dy++) {
                const nx = cell.x + dx;
                const ny = cell.y + dy;
                if (
                  !ship.cells.some((c) => c.x === nx && c.y === ny) &&
                  !enemy.ships?.some((s) =>
                    s.hits.some((h) => h.x === nx && h.y === ny),
                  ) &&
                  nx >= 0 &&
                  ny >= 0 &&
                  nx < 10 &&
                  ny < 10
                ) {
                  misses.push({ x: nx, y: ny });
                }
              }
            }
          });
        } else {
          status = 'shot';
        }
        break;
      }
    }

    if (status === 'miss') {
      game.currentTurn = enemy.playerId;
    } else {
      game.currentTurn = playerId;
    }

    return {
      position: { x, y },
      status,
      misses,
    };
  }
}

export const gamesRepository = new GamesRepository(games);
