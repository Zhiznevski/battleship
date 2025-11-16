import { playersRepository } from '../db/players';
import { prepareMessage } from '../utils/prepareMessage';
import { MESSAGE_TYPES_MAP } from '../consts/messages';
import { roomsRepository } from '../db/rooms';
import { Client } from '../types/client';
import { gameControllers } from './gameControllers';

const createRoom = async (ws: Client) => {
  const room = roomsRepository.createRoom();
  const player = playersRepository.getPlayerById(ws.id);
  if (!player) return;
  roomsRepository.addPlayerToRoom(
    { name: player.name, index: player.index },
    room.roomId,
  );
  const rooms = roomsRepository.getRooms();
  ws.send(prepareMessage(MESSAGE_TYPES_MAP.UPDATE_ROOM, rooms));
};

const updateRoom = async (clients: Client[]) => {
  const rooms = roomsRepository.getRooms();
  clients.forEach((client) =>
    client.send(prepareMessage(MESSAGE_TYPES_MAP.UPDATE_ROOM, rooms)),
  );
};

const removeRoom = async (roomId: string) => {
  roomsRepository.deleteRoom(roomId);
};

const addPlayerToRoom = async (
  ws: Client,
  clients: Client[],
  data: unknown,
) => {
  const player = playersRepository.getPlayerById(ws.id);

  if (!player) return;

  if (
    data === null ||
    typeof data !== 'object' ||
    !('indexRoom' in data) ||
    typeof data.indexRoom !== 'string'
  )
    return;
  const room = roomsRepository.getRoomById(data.indexRoom);

  if (room?.roomUsers.find((user) => user.index === ws.id)) return;

  roomsRepository.addPlayerToRoom(
    { index: player.index, name: player.name },
    data.indexRoom,
  );
  const updatedRoom = roomsRepository.getRoomById(data.indexRoom);

  if (updatedRoom && updatedRoom.roomUsers.length === 2) {
    await gameControllers.createGame(clients, data.indexRoom);
    await roomsRepository.deleteRoom(data.indexRoom);
    await roomControllers.updateRoom(clients);
  }
};

export const roomControllers = {
  createRoom,
  updateRoom,
  addPlayerToRoom,
  removeRoom,
};
