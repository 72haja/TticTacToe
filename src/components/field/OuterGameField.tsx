import { $, component$, useContext, useSignal, useStore, useTask$ } from "@builder.io/qwik";
import { v4 as uuid } from "uuid";
import { GameField as GameFieldModel, OuterGameField, OuterGameFieldPosition, Position } from "../../models/GameField.ts";
import { SetGameFieldData } from "../../models/SetGameFieldData.ts";
import { SetPositionData } from "../../models/SetPositionData.ts";
import { SnackbarCTX, SnackbarState, SnackbarType } from "../../store/SnackbarStore.ts";
import { getAllowedOuterGameField } from "../../utils/getAllowedOuterGameField.ts";
import { initOuterGameField } from "../../utils/initGameField.ts";
import GameField from "./GameField.tsx";
import VictoryDialog from "./VictoryDialog.tsx";
import { ResetPlayerState } from "../../models/ResetPlayerState.ts";
import { socket } from "./Field.tsx";

interface ItemProps {
  player: any;
  player2: any;
  playerIcon: any;
  activePlayer: string;
  setActivePlayer: Function;
  room: string;
  roomFull: boolean;
}

export default component$<ItemProps>((props) => {
  const gameReady = useSignal(false);
  const gameFinished = useSignal(false);

  const outerGameField: OuterGameField = useStore(initOuterGameField());
  const allowedOuterGameField = useSignal<OuterGameFieldPosition | null>(null);

  const snackbarCTX = useContext(SnackbarCTX) as SnackbarState;

  const showSnackbar = $((text: string, type: SnackbarType) => {
    snackbarCTX.show = true;
    snackbarCTX.text = text;
    snackbarCTX.type = type;
    snackbarCTX.id = uuid();
  });

  const checkWinner = $((outerGameFieldPosition: OuterGameFieldPosition) => {
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

    if (gameWon) {
      gameFinished.value = true;
      allowedOuterGameField.value = null;
    }

    return gameWon;
  });

  const checkAndReplaceOldPlayerInField = $(async (newPlayer: string) => {
    const outerGameFields = Object.entries(outerGameField) as [
      OuterGameFieldPosition, { gameField: GameFieldModel }
    ][];

    const resetPlayerState: ResetPlayerState = {
      room: props.room,
      iconFromOtherPlayer: props.playerIcon,
      activePlayer: props.activePlayer,
      allowedOuterGameField: allowedOuterGameField.value,
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
        gameFieldObj.gameField[position] = newPlayer;
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
  });

  useTask$(({ track }) => {
    const newPlayer2 = track(() => props.player2);
    if (newPlayer2 === "") {
      if (gameReady.value) {
        showSnackbar("Spieler 2 hat das Spiel verlassen", "error");
      }
      return
    };
    checkAndReplaceOldPlayerInField(newPlayer2)
    gameReady.value = true;
    showSnackbar("Spieler 2 ist beigetreten", "success");
  });

  const setPosition = $((outerGameFieldPos: OuterGameFieldPosition, pos: Position, player: string) => {
    outerGameField[outerGameFieldPos].gameField[pos] = player;
    allowedOuterGameField.value = getAllowedOuterGameField(pos);
  });

  socket.on("set-position", (data: SetPositionData) => {
    outerGameField[data.outerGameFieldPosition].gameField[data.position] = props.player2;
    allowedOuterGameField.value = !!data.allowedOuterGameField
      && outerGameField[data.allowedOuterGameField].fieldWinner === null
      ? data.allowedOuterGameField
      : null;

    checkWinner(data.outerGameFieldPosition);
  });

  socket.on("set-game-field", (setGameFieldData: SetGameFieldData) => {
    const gameFieldObj = outerGameField[setGameFieldData.outerGameFieldPosition];
    const positions = Object.keys(setGameFieldData.gameField) as Position[];
    positions.forEach((position: Position) => {
      gameFieldObj.gameField[position] = setGameFieldData.gameField[position];
    });
    checkWinner(setGameFieldData.outerGameFieldPosition);
  });

  socket.on("reset-player-state", (data: ResetPlayerState) => {
    allowedOuterGameField.value = data.allowedOuterGameField;
  })

  const resetGameField = $(() => {
    Object.entries(outerGameField).forEach(([_, gameFieldObj]) => {
      const positions = Object.keys(gameFieldObj.gameField) as Position[];
      positions.forEach((position: Position) => {
        gameFieldObj.gameField[position] = "";
      });
      gameFieldObj.fieldWinner = null;
    });
    gameFinished.value = false;
  })

  const handleOnNewGame = $((data: string) => {
    props.setActivePlayer(data);
    resetGameField()
  });

  socket.on("new-game", () => {
    resetGameField();
  });

  return (
    <div class="w-full h-full">
      {gameFinished.value
        ? <VictoryDialog
          player={props.player}
          playerIcon={props.playerIcon}
          player2={props.player2}
          activePlayer={props.activePlayer}
          room={props.room}
          onNewGame={handleOnNewGame}
        />
        : ""
      }
      {
        props.roomFull
          ? <span> Room is full. Please try another room</span>
          : gameReady.value
            ? <div class="grid grid-cols-3 grid-rows-3 w-full h-full max-w-[100%]">
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
                      setPosition={setPosition}
                      gameReady={gameReady.value}
                      checkWinner={checkWinner}
                      setActivePlayer={props.setActivePlayer}
                      fieldWinner={outerGameField[outerGameFieldPosition].fieldWinner}
                      disabled={!!allowedOuterGameField.value && allowedOuterGameField.value !== outerGameFieldPosition}
                    />
                  );
                })
              }
            </div>
            : <span> Waiting for player 2 {props.player2}</span>
      }
    </div>
  );
});
