import WebSocket, { WebSocketServer } from 'ws';
import { messageSet } from '../consts/messages';
import { playerControllers } from '../controllers/playerControllers';

const PORT = 3000;

const wss = new WebSocketServer({ port: 3000 });
wss.clients

/*
    1. Получаем объект - { name: "Artem" }. Тут важно то что в данных у нас будет type -> то есть мы проверяем тайп и сначала в зависимости от него идем дальше
    2. !С помощью функции хэлпера нам нужно провалидировать поля этого объекта - identifyResponse({ name: "Artem" }) --------- у нас данные ведь с фронта отправляются уже, можем не валидировать пока что
    3. пр. хэлпера - data?.name и type data.name === "string" => записываем это имя в массив или куда-то еще
    4. Таким образом можно валидировать дальше и не только поля но и значения ( например валидация пароля и тд по необходимости)
    5. Нужно написать свой валидатор данных ( типо Zod ), принцип я описал выше, в случае невалидных данных выбрасываем ошибки или возвращаем объект ошибки где указываем поле
    6. Полезные абстракции - сохранить массив ошибок после валидации
    7. Уточнить какие бывают вообще типы ошибок и в каком виде их отправлять
    8. Мы храним данные только об игроках, остальные данные насквозь проходят, верно ведь?

*/
type Client = WebSocket;
let clients: Client[] = [];


wss.on('connection', function handleConnection(ws) {
    console.log(`ws server is started on port ${PORT}`)
    clients.push(ws);

    ws.on('error', console.error);

    ws.on('message', function handleMessage(rowData) {
        try {
            console.log('received: %s', rowData);
            const msg = JSON.parse(rowData.toString())
            const data = JSON.parse(msg.data)
            if (!msg.type || !messageSet.has(msg.type)) return; //TODO: handle this error and check ТЗ;
            switch (msg.type) {
                case "reg": {
                    playerControllers.addPlayer(ws, data)
                }
            }

        }
        catch (e) {
            console.error(e)
        }

    });

    ws.on('close', () => {
        clients = clients.filter(client => client !== ws); // TODO: check if it ok
        console.log('Client disconnected');
        console.log(clients) // TODO: check if client is removed
    });
});