import { playersRepository } from '../db/players';
import { prepareMessage } from '../utils/prepareMessage';
import { MESSAGE_TYPES_MAP } from '../consts/messages';
import { roomsRepository } from '../db/rooms';
import { Client } from '../types/client';

const createRoom = async (ws: Client) => {
  const room = roomsRepository.createRoom();
  const player = playersRepository.getPlayerById(ws.id);
  console.log(roomsRepository.getRooms(), playersRepository.getPlayers());
  if (!player) return;
  roomsRepository.addPlayerToRoom(player, room.roomId);
  const rooms = roomsRepository.getRooms();
  ws.send(prepareMessage(MESSAGE_TYPES_MAP.UPDATE_ROOM, rooms)); //need to refactor this function
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

const addPlayerToRoom = async (ws: Client, data: unknown) => {
  const player = playersRepository.getPlayerById(ws.id);

  if (!player) return;

  // validate data before maybe ?
  if (
    data === null ||
    typeof data !== 'object' ||
    !('indexRoom' in data) ||
    typeof data.indexRoom !== 'string'
  )
    return;
  roomsRepository.addPlayerToRoom(
    { index: player.index, name: player.name },
    data.indexRoom,
  );
  return data.indexRoom;
};

export const roomControllers = {
  createRoom,
  updateRoom,
  addPlayerToRoom,
  removeRoom,
};
