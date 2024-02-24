import { OuterGameFieldPosition, Position } from "./GameField";

export type SetPositionData = {
  outerGameFieldPosition: OuterGameFieldPosition;
  room: string;
  position: Position;
}