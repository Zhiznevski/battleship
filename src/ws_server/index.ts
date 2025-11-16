import { WebSocketServer } from 'ws';
import { MESSAGE_TYPES_MAP, messageSet } from '../consts/messages';
import { roomControllers } from '../controllers/roomsControllers';
import { Client } from '../types/client';
import { isJSON } from '../utils/isJson';
import { playerControllers } from '../controllers/playerControllers';
import { gameControllers } from '../controllers/gameControllers';
import { winnersControllers } from '../controllers/winnersControllers';
import { generateId } from '../utils/generateId';

let clients: Client[] = [];

export const wsServer = (port: number) => {
  const wss = new WebSocketServer({ port: port });
  console.log(`WS server started on port ${port}`);
  wss.on('connection', function handleConnection(ws: Client) {
    ws.id = generateId();
    clients.push(ws);

    ws.on('error', console.error);

    ws.on('message', async function handleMessage(rowData) {
      try {
        const msg = JSON.parse(rowData.toString());
        console.log('Received:', msg);
        const data = isJSON(msg.data) && JSON.parse(msg.data);
        if (!msg.type || !messageSet.has(msg.type)) return;
        switch (msg.type) {
          case MESSAGE_TYPES_MAP.REGISTER: {
            await playerControllers.addPlayer(ws, data);
            await roomControllers.updateRoom(clients);
            await winnersControllers.getWinners(clients);
            break;
          }
          case MESSAGE_TYPES_MAP.CREATE_ROOM: {
            await roomControllers.createRoom(ws);
            break;
          }
          case MESSAGE_TYPES_MAP.ADD_USER_TO_ROOM: {
            await roomControllers.addPlayerToRoom(ws, clients, data);
            break;
          }

          case MESSAGE_TYPES_MAP.ADD_SHIPS: {
            await gameControllers.addShips(clients, data);
            break;
          }

          case MESSAGE_TYPES_MAP.ATTACK: {
            await gameControllers.attack(clients, data);
            break;
          }

          case MESSAGE_TYPES_MAP.RANDOM_ATTACK: {
            await gameControllers.randomAttack(clients, data);
            break;
          }
        }
      } catch (e) {
        console.error(e);
      }
    });

    ws.on('close', () => {
      clients = clients.filter((client) => client !== ws);
      playerControllers.removePlayer(ws);
      console.log('Client disconnected');
      console.log(clients);
    });
  });
};
