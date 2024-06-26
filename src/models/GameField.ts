export type Position = "0.0" | "0.1" | "0.2" | "1.0" | "1.1" | "1.2" | "2.0" | "2.1" | "2.2";

export type GameField = {
  [position in Position]: string;
}

export type OuterGameFieldPosition = "top-left" | "top-center" | "top-right" | "center-left" | "center-center" | "center-right" | "bottom-left" | "bottom-center" | "bottom-right"
// export type OuterGameFieldPosition = "center-center";

export type OuterGameField = {
  [position in OuterGameFieldPosition]: {
    gameField: GameField
    fieldWinner: string | null
  };
}

export declare type Game = {
  gameFields: OuterGameField;
  activePlayer: string;
  allowedOuterGameField: OuterGameFieldPosition | null;
  winner: string | null;
}