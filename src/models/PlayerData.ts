import { Game } from "@/models/GameField";

export type PlayerData = {
  room: string;
  player: string;
  players?: string[];
  gameRoom?: any;
  game?: Game;
}