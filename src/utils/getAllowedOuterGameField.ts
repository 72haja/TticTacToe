import { OuterGameFieldPosition, Position } from "../models/GameField";

export function getAllowedOuterGameField(pos: Position): OuterGameFieldPosition {
  switch (pos) {
    case "0.0":
      return "top-left";
    case "0.1":
      return "top-center";
    case "0.2":
      return "top-right";
    case "1.0":
      return "center-left";
    case "1.1":
      return "center-center";
    case "1.2":
      return "center-right";
    case "2.0":
      return "bottom-left";
    case "2.1":
      return "bottom-center";
    case "2.2":
      return "bottom-right";
  }
}