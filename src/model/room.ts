export type RoomUser = { name: string; index: string };

export type Room = {
  roomId: string;
  roomUsers: RoomUser[];
};
