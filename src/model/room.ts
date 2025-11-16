import { Player, PlayerDTO } from './player';

export type RoomUser = { name: string; index: string | number };

export type Room = {
  roomId: string | number;
  roomUsers: RoomUser[];
};
