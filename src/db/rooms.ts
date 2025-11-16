import { Room, RoomUser } from '../model/room';
import { generateId } from '../utils/generateId';

const rooms: Room[] = [];

class RoomsRepository {
  rooms;
  constructor(rooms: Room[]) {
    this.rooms = rooms;
  }

  getRooms() {
    return this.rooms;
  }

  getRoomById(id: string) {
    return this.rooms.find((room) => room.roomId === id);
  }

  createRoom() {
    const room = { roomId: generateId(), roomUsers: [] };
    this.rooms.push(room);
    return room;
  }

  deleteRoom(roomId: string) {
    const roomIndex = this.rooms.findIndex((room) => roomId === room.roomId);
    this.rooms.splice(roomIndex, 1);
  }

  addPlayerToRoom(user: RoomUser, roomId: string) {
    const roomIndex = this.rooms.findIndex((room) => roomId === room.roomId);
    this.rooms[roomIndex]?.roomUsers?.push(user);
  }

  getPlayersIds(roomId: string) {
    const room = this.getRoomById(roomId);
    if (!room) return;
    return room.roomUsers.map((el) => el.index);
  }
}

export const roomsRepository = new RoomsRepository(rooms);
