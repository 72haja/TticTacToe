import { v4 as uuid } from "uuid";
import { GameField as GameFieldModel, OuterGameField as OuterGameFieldModel, OuterGameFieldPosition, Position } from "../../models/GameField";
import { ResetPlayerState } from "../../models/ResetPlayerState";
import { SetGameFieldData } from "../../models/SetGameFieldData";
import { SetPositionData } from "../../models/SetPositionData";
import { getAllowedOuterGameField } from "../../utils/getAllowedOuterGameField";
import { initOuterGameField } from "../../utils/initGameField";
import { socket } from "./Field";
import { GameField } from "./GameField";
import {VictoryDialog} from "./VictoryDialog";
import { useEffect, useState } from "react";

interface ItemProps {
  player: any;
  player2: any;
  playerIcon: any;
  activePlayer: string;
  setActivePlayer: Function;
  room: string;
  roomFull: boolean;
  setSnackbar: Function;
}

export function OuterGameField(props: ItemProps) {
  // const gameReady = useSignal(false);
  const [gameReady, setGameReady]: [boolean, (gameReady: boolean) => void] = useState(false);
  const [gameFinished, setGameFinished]: [boolean, (gameFinished: boolean) => void] = useState(false);

  // const outerGameField: OuterGameFieldModel = useStore(initOuterGameField());
  const [outerGameField, setOuterGameField]: [OuterGameFieldModel, (outerGameField: OuterGameFieldModel) => void] = useState(initOuterGameField());
  // const allowedOuterGameField = useSignal<OuterGameFieldPosition | null>(null);
  const [allowedOuterGameField, setAllowedOuterGameField]: [OuterGameFieldPosition | null, (allowedOuterGameField: OuterGameFieldPosition | null) => void] = useState(null as OuterGameFieldPosition | null);

  // const snackbarCTX = useContext(SnackbarCTX) as SnackbarState;

  // const setSnackbar = ((text: string, type: SnackbarType) => {
  //   snackbarCTX.show = true;
  //   snackbarCTX.text = text;
  //   snackbarCTX.type = type;
  //   snackbarCTX.id = uuid();
  // });

  // const gameDraw = useSignal(false);
  const [gameDraw, setGameDraw]: [boolean, (gameDraw: boolean) => void] = useState(false);

  function checkWinner(outerGameFieldPosition: OuterGameFieldPosition) {
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

    const relevantField = outerGameField[outerGameFieldPosition].gameField

    const fieldWon = winningPositions.find((winningPosition) =>
      relevantField[winningPosition[0]] === relevantField[winningPosition[1]] &&
      relevantField[winningPosition[1]] === relevantField[winningPosition[2]] &&
      relevantField[winningPosition[0]] !== ""
    );
    if (fieldWon) {
      outerGameField[outerGameFieldPosition].fieldWinner = relevantField[fieldWon[0]];
    }

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

    const tmpGameDraw = !gameWon && Object.values(outerGameField).every(
      (field) => field.gameField
        && Object.values(field.gameField).every((value) => value !== "")
    );
    setGameDraw(tmpGameDraw);
    console.log('gameDraw.value', gameDraw);

    if (gameWon || gameDraw) {
      setGameFinished(true);
      setAllowedOuterGameField(null);
    }

    return gameWon;
  };

  function setPosInOuterGameFieldPos(outerGameFieldPosition: OuterGameFieldPosition, pos: Position, player: string) {
    // outerGameField[outerGameFieldPosition].gameField[pos] = player;
    const tmpOuterGameField = { 
      ...outerGameField,
      [outerGameFieldPosition]: {
        ...outerGameField[outerGameFieldPosition],
        gameField: {
          ...outerGameField[outerGameFieldPosition].gameField,
          [pos]: player,
        }
      }
    };
    setOuterGameField(tmpOuterGameField);
  }

  async function checkAndReplaceOldPlayerInField(newPlayer: string) {
    const outerGameFields = Object.entries(outerGameField) as [
      OuterGameFieldPosition, { gameField: GameFieldModel }
    ][];

    const resetPlayerState: ResetPlayerState = {
      room: props.room,
      iconFromOtherPlayer: props.playerIcon,
      activePlayer: props.activePlayer,
      allowedOuterGameField: allowedOuterGameField,
    };
    socket.emit("reset-player-state", resetPlayerState);

    outerGameFields.forEach(([outerGameFieldPosition, gameFieldObj]) => {
      const positions = Object.keys(gameFieldObj.gameField) as Position[];

      const fieldsOfOldPlayer = positions.filter(
        (position: Position) => {
          return gameFieldObj.gameField[position] !== "" &&
            gameFieldObj.gameField[position] !== props.player;
        },
      );
      fieldsOfOldPlayer.forEach((position: Position) => {
        setPosInOuterGameFieldPos(outerGameFieldPosition, position, newPlayer);
      });
      const anyFieldIsSet = Object.values(gameFieldObj.gameField).some((value: string) => value !== "");
      if (anyFieldIsSet) {
        const setGameFieldData: SetGameFieldData = {
          room: props.room,
          gameField: gameFieldObj.gameField,
          outerGameFieldPosition,
        };
        socket.emit("set-game-field", setGameFieldData);
      }
    });
  };

  // useTask(({ track }) => {
  //   const newPlayer2 = track(() => props.player2);
  //   if (newPlayer2 === "") {
  //     if (gameReady.value) {
  //       setSnackbar("Spieler 2 hat das Spiel verlassen", "error");
  //     }
  //     return
  //   };
  //   checkAndReplaceOldPlayerInField(newPlayer2)
  //   gameReady.value = true;
  //   setSnackbar("Spieler 2 ist beigetreten", "success");
  // });

  useEffect(() => {
    console.log('props.player2', props.player2);
    if (props.player2 === "") {
      if (gameReady) {
        props.setSnackbar("Spieler 2 hat das Spiel verlassen", "error");
      }
      return
    }
    checkAndReplaceOldPlayerInField(props.player2)
    setGameReady(true);
    props.setSnackbar("Spieler 2 ist beigetreten", "success");
  }, [props.player2]);

  function setPosition(outerGameFieldPos: OuterGameFieldPosition, pos: Position, player: string) {
    // outerGameField[outerGameFieldPos].gameField[pos] = player;
    setPosInOuterGameFieldPos(outerGameFieldPos, pos, player);
    // allowedOuterGameField.value = getAllowedOuterGameField(pos);
    const allowedOuterGameField = getAllowedOuterGameField(pos);
    setAllowedOuterGameField(allowedOuterGameField);
  };

  socket.on("set-position", (data: SetPositionData) => {
    outerGameField[data.outerGameFieldPosition].gameField[data.position] = props.player2;
    const allowedGameField = !!data.allowedOuterGameField
      && outerGameField[data.allowedOuterGameField].fieldWinner === null
      ? data.allowedOuterGameField
      : null;
    setAllowedOuterGameField(allowedGameField);

    checkWinner(data.outerGameFieldPosition);
  });

  socket.on("set-game-field", (setGameFieldData: SetGameFieldData) => {
    const gameFieldObj = outerGameField[setGameFieldData.outerGameFieldPosition];
    const positions = Object.keys(setGameFieldData.gameField) as Position[];
    positions.forEach((position: Position) => {
      setPosInOuterGameFieldPos(setGameFieldData.outerGameFieldPosition, position, setGameFieldData.gameField[position]);
    });
    checkWinner(setGameFieldData.outerGameFieldPosition);
  });

  socket.on("reset-player-state", (data: ResetPlayerState) => {
    setAllowedOuterGameField(data.allowedOuterGameField);
  })

  function resetGameField() {
    setOuterGameField(initOuterGameField());
    setGameFinished(false);
    setGameDraw(false);
  };

  function handleOnNewGame(data: string) {
    props.setActivePlayer(data);
    resetGameField()
  };

  socket.on("new-game", () => {
    resetGameField();
  });

  return (
    <div className="w-full h-full">
      {gameFinished
        && <VictoryDialog
          player={props.player}
          playerIcon={props.playerIcon}
          player2={props.player2}
          activePlayer={props.activePlayer}
          room={props.room}
          gameDraw={gameDraw}
          onNewGame={handleOnNewGame}
        />
      }
      {
        props.roomFull
          ? <span> Room is full. Please try another room</span>
          : gameReady
            ? <div className="grid grid-cols-3 grid-rows-3 w-full h-full max-w-[100%]">
              {(Object.entries(outerGameField) as [
                OuterGameFieldPosition, { gameField: GameFieldModel }
              ][])
                .map(([outerGameFieldPosition, gameFieldObj]) => {
                  return (
                    <GameField
                      key={outerGameFieldPosition}
                      player={props.player}
                      player2={props.player2}
                      playerIcon={props.playerIcon}
                      activePlayer={props.activePlayer}
                      outerGameFieldPosition={outerGameFieldPosition}
                      room={props.room}
                      gameField={gameFieldObj.gameField}
                      gameReady={gameReady}
                      setPosition={setPosition}
                      checkWinner={checkWinner}
                      setActivePlayer={props.setActivePlayer}
                      fieldWinner={outerGameField[outerGameFieldPosition].fieldWinner}
                      disabled={!!allowedOuterGameField && allowedOuterGameField !== outerGameFieldPosition}
                    />
                  );
                })
              }
            </div>
            : <span> Waiting for player 2 {props.player2}</span>
      }
    </div>
  );
};
