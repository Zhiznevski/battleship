import { httpServer } from './http_server/index';
import './ws_server';
import { wsServer } from './ws_server';

const HTTP_PORT = 8181;

const WS_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

wsServer(WS_PORT);
