import { OuterGameFieldPosition } from "./GameField";
import { IconName } from "./IconName";

export type ResetPlayerState = {
  room: string;
  iconFromOtherPlayer: IconName;
  activePlayer: string;
  allowedOuterGameField: OuterGameFieldPosition | null;
}