import { Game, OuterGameField, OuterGameFieldPosition, Position } from "@/models/GameField";
import { SetPositionData } from "@/models/SetPositionData";
import { getAllowedOuterGameField } from "@/utils/getAllowedOuterGameField";

function getFieldWinner(
  outerGameFieldPosition: OuterGameFieldPosition,
  tmpOuterGameField: OuterGameField
) {
  const winningPositions: Position[][] = [
    ["0.0", "0.1", "0.2"],
    ["1.0", "1.1", "1.2"],
    ["2.0", "2.1", "2.2"],
    ["0.0", "1.0", "2.0"],
    ["0.1", "1.1", "2.1"],
    ["0.2", "1.2", "2.2"],
    ["0.0", "1.1", "2.2"],
    ["0.2", "1.1", "2.0"],
  ];

  const relevantField = tmpOuterGameField[outerGameFieldPosition].gameField

  const fieldWon = winningPositions.find((winningPosition) => {
    const [pos1, pos2, pos3] = winningPosition;
    const field1 = relevantField[pos1];
    const field2 = relevantField[pos2];
    const field3 = relevantField[pos3];
    return field1 === field2 && field2 === field3 && field1 !== "";
  });

  if (fieldWon) {
    // setPosInOuterGameFieldWinner(outerGameFieldPosition, relevantField[fieldWon[0]]);
    return relevantField[fieldWon[0]];
  }
  return undefined;
};


function getGameWinner(
  outerGameField: OuterGameField,
): boolean  | string {
  const winningPositionsOuterGameField: OuterGameFieldPosition[][] = [
    ["top-left", "top-center", "top-right"],
    ["center-left", "center-center", "center-right"],
    ["bottom-left", "bottom-center", "bottom-right"],
    ["top-left", "center-left", "bottom-left"],
    ["top-center", "center-center", "bottom-center"],
    ["top-right", "center-right", "bottom-right"],
    ["top-left", "center-center", "bottom-right"],
    ["top-right", "center-center", "bottom-left"],
  ];
  const gameWon = winningPositionsOuterGameField.some((winningPosition) => {
    const [outerGameFieldPos1, outerGameFieldPos2, outerGameFieldPos3] = winningPosition;
    const field1 = outerGameField[outerGameFieldPos1].fieldWinner;
    const field2 = outerGameField[outerGameFieldPos2].fieldWinner;
    const field3 = outerGameField[outerGameFieldPos3].fieldWinner;
    return field1 === field2 && field2 === field3 && field1 !== null;
  })

  const gameDraw = !gameWon && Object.values(outerGameField).every(
    (field) => field.gameField
      && Object.values(field.gameField).every((value) => value !== "")
  );

  if (gameDraw) {
    return "draw";
  }

  return gameWon;
}

function handleSetPosition(data: SetPositionData, game: Game, gameRooms: Record<string, string[]>) {
  const localGameField: Game = JSON.parse(JSON.stringify(game));
  localGameField.gameFields[data.outerGameFieldPosition].gameField[data.position] = data.player;

  const fieldWinner = getFieldWinner(
    data.outerGameFieldPosition,
    localGameField.gameFields
  );
  if(fieldWinner) {
    localGameField.gameFields[data.outerGameFieldPosition].fieldWinner = fieldWinner;
  }

  const gameWinner = getGameWinner(
    localGameField.gameFields
  );
  if(gameWinner === true) {
    localGameField.winner = localGameField.activePlayer;
    return localGameField;
  } else if (gameWinner === "draw") {
    localGameField.winner = "draw";
    return localGameField;
  }
  
  const allowedOuterGameField = getAllowedOuterGameField(data.position);
  if(localGameField.gameFields[allowedOuterGameField].fieldWinner) {
    localGameField.allowedOuterGameField = null;
  } else {
    localGameField.allowedOuterGameField = allowedOuterGameField;
  }

  localGameField.activePlayer = data.player === gameRooms[data.room][0] 
    ? gameRooms[data.room][1]
    : gameRooms[data.room][0];

  return localGameField;
}

export {
  getFieldWinner,
  getGameWinner,
  handleSetPosition,
}