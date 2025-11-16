import { prepareMessage } from '../utils/prepareMessage';
import { MESSAGE_TYPES_MAP } from '../consts/messages';
import { Client } from '../types/client';
import { winnersRepository } from '../db/winners';

const getWinners = async (clients: Client[]) => {
  const winners = winnersRepository.getWinners();
  const winnersWithoutIds = winners.map((winner) => ({
    name: winner.name,
    wins: winner.wins,
  }));
  clients.forEach((client) =>
    client.send(
      prepareMessage(MESSAGE_TYPES_MAP.UPDATE_WINNERS, winnersWithoutIds),
    ),
  );
};

export const winnersControllers = {
  getWinners,
};
