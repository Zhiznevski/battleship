import { MESSAGE_TYPES_MAP } from "../consts/messages";
import { gamesRepository } from "../db/games";
import { roomsRepository } from "../db/rooms";
import { Ship } from "../model/game";
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

const addShips = async (ws: Client, clients: Client[], data: unknown) => {
  const { gameId, ships, indexPlayer } = data as {
    gameId: string;
    ships: Ship[];
    indexPlayer: string;
  };

  const game = gamesRepository.addShips(gameId, indexPlayer, ships)
  if (!game) return;
  if (!gamesRepository.isGameReady(gameId)) return;

  console.log("we are here");

  game.players.forEach(player => {
    const client = clients.find(c => c.id === player.playerId);
    if (!client) return;
    client.send(prepareMessage(MESSAGE_TYPES_MAP.START_GAME, {
      ships: player.ships,
      currentPlayerIndex: player.playerId
    }))
  })

  const currentTurn = gamesRepository.getRandomTurn(game.gameId)

  game.players.forEach(player => {
    const client = clients.find(c => c.id === player.playerId);
    if (!client) return;
    client.send(
      prepareMessage(MESSAGE_TYPES_MAP.TURN, {
        currentPlayer: currentTurn,
      })
    );
  });
}


export const gameControllers = {
  createGame,
  addShips
};
