import WebSocket, { WebSocketServer } from 'ws';
import { v4 as generateId } from 'uuid';
import { MESSAGE_TYPES_MAP, messageSet } from '../consts/messages';
import { roomControllers } from '../controllers/roomsControllers';
import { Client } from '../types/client';
import { isJSON } from '../utils/isJson';
import { playerControllers } from '../controllers/playerControllers';
import { gameControllers } from '../controllers/gameControllers';

const PORT = 3000;

let clients: Client[] = [];

export const wsServer = (port: number) => {
  const wss = new WebSocketServer({ port: port });

  wss.on('connection', function handleConnection(ws: Client) {
    console.log(`ws server is started on port ${PORT}`);
    ws.id = generateId();
    clients.push(ws);

    ws.on('error', console.error);

    ws.on('message', async function handleMessage(rowData) {
      try {
        const msg = JSON.parse(rowData.toString());
        console.log('received', msg);
        const data = isJSON(msg.data) && JSON.parse(msg.data);
        if (!msg.type || !messageSet.has(msg.type)) return; //TODO: handle this error and check ТЗ;
        switch (msg.type) {
          case MESSAGE_TYPES_MAP.REGISTER: {
            await playerControllers.addPlayer(ws, data);
            await roomControllers.updateRoom(clients);
            break;
          }
          case MESSAGE_TYPES_MAP.CREATE_ROOM: {
            await roomControllers.createRoom(ws);
            break;
          }

          case MESSAGE_TYPES_MAP.ADD_USER_TO_ROOM: {
            const indexRoom = await roomControllers.addPlayerToRoom(ws, data);
            await roomControllers.updateRoom(clients);
            if (!indexRoom) return;
            await gameControllers.createGame(clients, indexRoom)
            await roomControllers.removeRoom(indexRoom);
            break;
          }
        }
      } catch (e) {
        console.error(e);
      }
    });

    ws.on('close', () => {
      clients = clients.filter((client) => client !== ws);
      playerControllers.removePlayer(ws); // TODO: check if it ok
      console.log('Client disconnected');
      console.log(clients); // TODO: check if client is removed
    });
  });
};
