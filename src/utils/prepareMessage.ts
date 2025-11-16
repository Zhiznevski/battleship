import { MessageType } from '../types/message';

export const prepareMessage = (type: MessageType, data: unknown, id = 0) => {
  const dataToJSON = JSON.stringify(data);
  const msg = JSON.stringify({
    type,
    data: dataToJSON,
    id,
  });
  return msg;
};
