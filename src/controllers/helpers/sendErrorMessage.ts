import { WebSocket } from 'ws';
import { prepareMessage } from '../../utils/prepareMessage';
import { MessageType } from '../../types/message';

export const sendErrorMessage = (
  ws: WebSocket,
  messageType: MessageType,
  errorMessage: string,
) => {
  ws.send(
    prepareMessage(messageType, {
      error: true,
      errorText: errorMessage,
    }),
  );
};
