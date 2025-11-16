import { WebSocket } from 'ws';

export type Client = WebSocket & { id: string };
