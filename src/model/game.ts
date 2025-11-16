
type GamePlayer = {
  playerId: string,
  ships?: Ship[],
}
export type Game = {
  gameId: string;
  players: GamePlayer[],
  currentTurn?: string,
};


export type Ship = {
  position: {
    x: number,
    y: number,
  },
  direction: boolean,
  length: number,
  type: "small" | "medium" | "large" | "huge",
}
