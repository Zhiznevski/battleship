import { MESSAGE_TYPES_MAP } from "../consts/messages";
import { gamesRepository } from "../db/games";
import { roomsRepository } from "../db/rooms";
import { Client } from "../types/client";
import { prepareMessage } from "../utils/prepareMessage";

const createGame = async (clients: Client[], indexRoom: string) => {
  const playersIds = roomsRepository.getPlayersIds(indexRoom)
  if (!playersIds) return;
  const game = gamesRepository.createGame(playersIds)
  playersIds?.forEach(playerId => {
    const client = clients.find(c => c.id === playerId);
    if (!client) return;

    client.send(
      prepareMessage(MESSAGE_TYPES_MAP.CREATE_GAME, {
        idGame: game.gameId,
        idPlayer: client.id
      })
    );
  });
};

export const gameControllers = {
  createGame
};
