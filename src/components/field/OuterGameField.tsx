import { $, component$, useContext, useSignal, useStore, useTask$ } from "@builder.io/qwik";
import { v4 as uuid } from "uuid";
import { GameField as GameFieldModel, Position } from "../../models/GameField.ts";
import { SnackbarCTX, SnackbarState, SnackbarType } from "../../store/SnackbarStore.ts";
import { socket } from "./Field.tsx";
import GameField from "./GameField.tsx";
import VictoryDialog from "./VictoryDialog.tsx";

interface ItemProps {
  player: any;
  player2: any;
  playerIcon: any;
  activePlayer: string;
  setActivePlayer: Function;
  room: string;
}

type SetPositionData = {
  room: string;
  position: Position;
}

export default component$<ItemProps>((props) => {
  const gameReady = useSignal(false);
  const gameFinished = useSignal(false);

  const gameField: GameFieldModel = useStore({
    "0.0": "",
    "0.1": "",
    "0.2": "",
    "1.0": "",
    "1.1": "",
    "1.2": "",
    "2.0": "",
    "2.1": "",
    "2.2": "",
  });

  const snackbarCTX = useContext(SnackbarCTX) as SnackbarState;

  const showSnackbar = $((text: string, type: SnackbarType) => {
    snackbarCTX.show = true;
    snackbarCTX.text = text;
    snackbarCTX.type = type;
    snackbarCTX.id = uuid();
  });

  const checkAndReplaceOldPlayerInField = $(async (newPlayer: string) => {
    const positions = Object.keys(gameField) as Position[];

    const fieldsOfOldPlayer = positions.filter(
      (position: Position) => {
        return gameField[position] !== "" &&
          gameField[position] !== props.player;
      },
    );
    fieldsOfOldPlayer.forEach((position: Position) => {
      gameField[position] = newPlayer;
    });
    if (fieldsOfOldPlayer.length > 0) {
      socket.emit("set-game-field", { room: props.room, gameField });
    }
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

  const checkWinner = $(() => {
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
    const won = winningPositions.some((winningPosition) =>
      gameField[winningPosition[0]] === gameField[winningPosition[1]] &&
      gameField[winningPosition[1]] === gameField[winningPosition[2]] &&
      gameField[winningPosition[0]] !== ""
    );

    if (won) {
      gameFinished.value = true;
    }
    return won;
  });

  const setPosition = $((pos: Position, player: string) => {
    gameField[pos] = player;
  });

  socket.on("set-position", (data: SetPositionData) => {
    gameField[data.position] = props.player2;
    checkWinner();
  });

  socket.on("set-game-field", (tmpGameField: GameFieldModel) => {
    const positions = Object.keys(tmpGameField) as Position[];
    positions.forEach((position: Position) => {
      gameField[position] = tmpGameField[position];
    });
  });

  const resetGameField = $(() => {
    const positions = Object.keys(gameField) as Position[];
    positions.forEach((position: Position) => {
      gameField[position] = "";
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
      {gameReady.value
        ?
        // <div class="grid grid-cols-3 grid-rows-3 w-full h-full max-w-[100%]">
        //   {(Object.keys(gameField) as Position[]).map((position: Position) => {
        // return (
        <GameField
          player={props.player}
          player2={props.player2}
          playerIcon={props.playerIcon}
          activePlayer={props.activePlayer}
          setActivePlayer={props.setActivePlayer}
          outerGameFieldPosition={"center-center"}
          room={props.room}
          gameField={gameField}
          setPosition={setPosition}
          gameReady={gameReady.value}
          checkWinner={checkWinner}
        />
        // );
        // })}
        // </div>
        : <span> Waiting for player 2 {props.player2}</span>
      }
    </div>
  );
});