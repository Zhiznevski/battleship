import { messagesTypes } from '../consts/messages';

export type MessageType = (typeof messagesTypes)[number];

export type Message = {
  type: MessageType;
  data: unknown;
  id: 0;
};
