import { MESSAGE_TYPES_MAP } from '../consts/messages';
import { gamesRepository } from '../db/games';
import { playersRepository } from '../db/players';
import { roomsRepository } from '../db/rooms';
import { Ship } from '../model/game';
import { Client } from '../types/client';
import { prepareMessage } from '../utils/prepareMessage';
import { winnersControllers } from './winnersControllers';

const createGame = async (clients: Client[], indexRoom: string) => {
  const playersIds = roomsRepository.getPlayersIds(indexRoom);
  if (!playersIds) return;
  const game = gamesRepository.createGame(playersIds);
  playersIds?.forEach((playerId) => {
    const client = clients.find((c) => c.id === playerId);
    if (!client) return;

    client.send(
      prepareMessage(MESSAGE_TYPES_MAP.CREATE_GAME, {
        idGame: game.gameId,
        idPlayer: client.id,
      }),
    );
  });
};

const addShips = async (clients: Client[], data: unknown) => {
  const { gameId, ships, indexPlayer } = data as {
    gameId: string;
    ships: Ship[];
    indexPlayer: string;
  };

  const game = gamesRepository.addShips(gameId, indexPlayer, ships);
  if (!game) return;
  if (!gamesRepository.isGameReady(gameId)) return;

  game.players.forEach((player) => {
    const client = clients.find((c) => c.id === player.playerId);
    if (!client) return;
    client.send(
      prepareMessage(MESSAGE_TYPES_MAP.START_GAME, {
        ships: player.ships,
        currentPlayerIndex: player.playerId,
      }),
    );
  });

  const currentTurn = gamesRepository.getRandomTurn(game.gameId);

  game.players.forEach((player) => {
    const client = clients.find((c) => c.id === player.playerId);
    if (!client) return;
    client.send(
      prepareMessage(MESSAGE_TYPES_MAP.TURN, {
        currentPlayer: currentTurn,
      }),
    );
  });
};

const attack = async (clients: Client[], data: unknown) => {
  const { gameId, indexPlayer, x, y } = data as {
    gameId: string;
    x: number;
    y: number;
    indexPlayer: string;
  };

  const game = gamesRepository.getGameById(gameId);
  if (!game) return;

  const attackResult = gamesRepository.attack(gameId, indexPlayer, x, y);
  if (!attackResult) return;
  const { position, status, misses, winner } = attackResult;

  game.players.forEach((player) => {
    const client = clients.find((c) => c.id === player.playerId);
    if (!client) return;
    client.send(
      prepareMessage(MESSAGE_TYPES_MAP.ATTACK, {
        position: position,
        currentPlayer: indexPlayer,
        status: status,
      }),
    );

    if (!misses?.length) return;

    misses.forEach((miss) => {
      client.send(
        prepareMessage(MESSAGE_TYPES_MAP.ATTACK, {
          status: 'miss',
          position: miss,
          currentPlayer: indexPlayer,
        }),
      );
    });
  });
  if (winner) {
    game.players.forEach((player) => {
      const client = clients.find((c) => c.id === player.playerId);
      if (!client) return;
      client.send(
        prepareMessage(MESSAGE_TYPES_MAP.FINISH, {
          winPlayer: winner,
        }),
      );
    });

    const winnerName = playersRepository.getPlayerById(winner)?.name;
    if (!winnerName) return;
    await winnersControllers.addWinner(winner, winnerName);
    await winnersControllers.getWinners(clients);
    return;
  }
  const currentTurn = gamesRepository.getCurrentTurn(game.gameId);

  game.players.forEach((player) => {
    const client = clients.find((c) => c.id === player.playerId);
    if (!client) return;
    client.send(
      prepareMessage(MESSAGE_TYPES_MAP.TURN, {
        currentPlayer: currentTurn,
      }),
    );
  });
};

const randomAttack = async (clients: Client[], data: unknown) => {
  const { gameId, indexPlayer } = data as {
    gameId: string;
    indexPlayer: string;
  };

  const game = gamesRepository.getGameById(gameId);
  if (!game) return;

  const attackResult = gamesRepository.randomAttack(gameId, indexPlayer);
  if (!attackResult) return;
  const { position, status, misses, winner } = attackResult;

  game.players.forEach((player) => {
    const client = clients.find((c) => c.id === player.playerId);
    if (!client) return;
    client.send(
      prepareMessage(MESSAGE_TYPES_MAP.ATTACK, {
        position,
        currentPlayer: indexPlayer,
        status,
      }),
    );

    if (!misses?.length) return;

    misses.forEach((miss) => {
      client.send(
        prepareMessage(MESSAGE_TYPES_MAP.ATTACK, {
          status: 'miss',
          position: miss,
          currentPlayer: indexPlayer,
        }),
      );
    });
  });

  if (winner) {
    game.players.forEach((player) => {
      const client = clients.find((c) => c.id === player.playerId);
      if (!client) return;
      client.send(
        prepareMessage(MESSAGE_TYPES_MAP.FINISH, {
          winPlayer: winner,
        }),
      );
    });
    const winnerName = playersRepository.getPlayerById(winner)?.name;
    if (!winnerName) return;
    await winnersControllers.addWinner(winner, winnerName);
    await winnersControllers.getWinners(clients);
    return;
  }

  const currentTurn = gamesRepository.getCurrentTurn(game.gameId);

  game.players.forEach((player) => {
    const client = clients.find((c) => c.id === player.playerId);
    if (!client) return;
    client.send(
      prepareMessage(MESSAGE_TYPES_MAP.TURN, {
        currentPlayer: currentTurn,
      }),
    );
  });
};

export const gameControllers = {
  createGame,
  addShips,
  attack,
  randomAttack,
};
