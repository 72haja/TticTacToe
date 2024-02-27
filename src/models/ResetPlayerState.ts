import type { OuterGameFieldPosition } from "./GameField";
import type { IconName } from "./IconName";

export type ResetPlayerState = {
  room: string;
  iconFromOtherPlayer: IconName;
  activePlayer: string;
  allowedOuterGameField: OuterGameFieldPosition | null;
}