import WebSocket, { WebSocketServer } from 'ws';
import { v4 as generateId } from 'uuid';
import { MESSAGE_TYPES_MAP, messageSet } from '../consts/messages';
import { roomControllers } from '../controllers/roomsControllers';
import { Client } from '../types/client';
import { isJSON } from '../utils/isJson';
import { playerControllers } from '../controllers/playerControllers';

const PORT = 3000;

// wss.clients

/*
    1. Мы храним данные только об игроках, остальные данные насквозь проходят, верно ведь?  - Нет, храним все

*/

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
                        await roomControllers.updateRoom(ws);
                    }
                    case MESSAGE_TYPES_MAP.CREATE_ROOM: {
                        console.log('мы тут');
                        await roomControllers.createRoom(ws);
                    }

                    case MESSAGE_TYPES_MAP.ADD_USER_TO_ROOM: {
                        const indexRoom = await roomControllers.addPlayerToRoom(ws, data);
                        if (!indexRoom) return;
                        await roomControllers.removeRoom(indexRoom);
                    }
                }
            } catch (e) {
                console.error(e);
            }
        });

        ws.on('close', () => {
            clients = clients.filter((client) => client !== ws); // TODO: check if it ok
            console.log('Client disconnected');
            console.log(clients); // TODO: check if client is removed
        });
    });
};
