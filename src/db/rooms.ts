import { v4 as generateId } from 'uuid';
import { Room, RoomUser } from '../model/room';

const rooms: Room[] = [];

class RoomsRepository {
    rooms;
    constructor(rooms: Room[]) {
        this.rooms = rooms;
    }

    getRooms() {
        return this.rooms;
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
}

export const roomsRepository = new RoomsRepository(rooms);
