import { Winner } from '../model/winner';

const winners: Winner[] = [];

class WinnersRepository {
  private winners: Winner[] = [];
  constructor(winners: Winner[]) {
    this.winners = winners ?? []
  }

  addWin(playerId: string, name: string) {
    const index = this.winners.findIndex(winner => winner.playerId === playerId)
    if (index !== -1) {
      const winner = this.winners[index];
      if (!winner) return;
      winner.wins += 1
      return;
    }
    this.winners.push({ name: name, playerId: playerId, wins: 1 });
  }
  getWinners() {
    return this.winners;
  }
}

export const winnersRepository = new WinnersRepository(winners);
