import { GameField, OuterGameField } from "../models/GameField";

export function initGameField(): GameField {
  return {
    "0.0": "",
    "0.1": "",
    "0.2": "",
    "1.0": "",
    "1.1": "",
    "1.2": "",
    "2.0": "",
    "2.1": "",
    "2.2": "",
  };
}

export function initOuterGameField(): OuterGameField {
  return {
    "top-left": {
      gameField: initGameField(),
      fieldWinner: null,
    },
    "top-center": {
      gameField: initGameField(),
      fieldWinner: null,
    },
    "top-right": {
      gameField: initGameField(),
      fieldWinner: null,
    },
    "center-left": {
      gameField: initGameField(),
      fieldWinner: null,
    },
    "center-center": {
      gameField: initGameField(),
      fieldWinner: null,
    },
    "center-right": {
      gameField: initGameField(),
      fieldWinner: null,
    },
    "bottom-left": {
      gameField: initGameField(),
      fieldWinner: null,
    },
    "bottom-center": {
      gameField: initGameField(),
      fieldWinner: null,
    },
    "bottom-right": {
      gameField: initGameField(),
      fieldWinner: null,
    },
  };
}