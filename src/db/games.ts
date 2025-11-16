import { v4 as generateId } from 'uuid';
import { Room, RoomUser } from '../model/room';
import { Game } from '../model/game';

const games: Game[] = [];

class GamesRepository {
  games;
  constructor(games: Game[]) {
    this.games = games;
  }

  getGames() {
    return this.games;
  }

  createGame(players: string[]) {
    const game = { gameId: generateId(), players: players };
    this.games.push(game);
    return game;
  }

  // deleteRoom(roomId: string) {
  //   const roomIndex = this.rooms.findIndex((room) => roomId === room.roomId);
  //   this.rooms.splice(roomIndex, 1);
  // }

  // addPlayerToRoom(user: RoomUser, roomId: string) {
  //   const roomIndex = this.rooms.findIndex((room) => roomId === room.roomId);
  //   this.rooms[roomIndex]?.roomUsers?.push(user);
  // }
}

export const gamesRepository = new GamesRepository(games);
