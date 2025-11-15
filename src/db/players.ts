import { v4 as generateId } from 'uuid';
import { Player, PlayerDTO } from "../model/player";

const players: Player[] = [];


class PlayersRepository {
    players;
    constructor(players: Player[]) {
        this.players = players;
    }

    getPlayers() {
        return this.players;
    }

    getPlayerById(index: string) {
        return this.players.find(player => player.index === index)
    }

    addPlayer(data: PlayerDTO): Player {
        const player = { name: data.name, password: data.password, index: generateId() }
        this.players.push(player)
        return player;
    }

    deletePlayer(index: string) {
        const playerIndex = this.players.findIndex((player) => player.index === index);
        this.players.splice(playerIndex, 1);
    }
}

export const playersRepository = new PlayersRepository(players);