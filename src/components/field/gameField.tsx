import { $, component$, useContext, useSignal, useStore, useTask$ } from "@builder.io/qwik";
import { SnackbarCTX, SnackbarState, SnackbarType } from "../../store/SnackbarStore.ts";
import { socket } from "./Field.tsx";
import Player1Icon from "./Player1Icon.tsx";
import Player2Icon from "./Player2Icon.tsx";
import VictoryDialog from "./VictoryDialog.tsx";
import { v4 as uuid } from "uuid";

interface ItemProps {
  player: any;
  player2: any;
  playerIcon: any;
  activePlayer: string;
  setActivePlayer: Function;
  room: any;
}

interface SetPositionData {
  room: string;
  position: string;
}

interface GameField {
  [position: string]: string;
}

export default component$<ItemProps>((props) => {
  const gameReady = useSignal(false);
  const gameFinished = useSignal(false);

  const gameField: GameField = useStore({
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
    const fieldsOfOldPlayer = Object.keys(gameField).filter(
      (position: string) => {
        return gameField[position] !== "" &&
          gameField[position] !== props.player;
      },
    );
    fieldsOfOldPlayer.forEach((position: string) => {
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
    const winningPositions = [
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

  const sendPosition = $(async (pos: string) => {
    const setPositionData: SetPositionData = {
      room: props.room,
      position: pos,
    };
    gameField[pos] = props.player;
    socket.emit("set-position", setPositionData);
    if (await checkWinner()) {
      return;
    }
    props.setActivePlayer(props.player2);
  });

  socket.on("set-position", (data: any) => {
    gameField[data.position] = props.player2;
    checkWinner();
  });

  socket.on("set-game-field", (tmpGameField: GameField) => {
    Object.keys(tmpGameField).forEach((position: string) => {
      gameField[position] = tmpGameField[position];
    });
  });

  const resetGameField = $(() => {
    Object.keys(gameField)
      .forEach((position: string) => {
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
        ? <div class="grid grid-cols-3 grid-rows-3 w-full h-full max-w-[100%]">
          {Object.keys(gameField).map((position: string) => {
            return (
              <button
                onClick$={() => (sendPosition(position))}
                class="w-full h-full border border-gray-600 grid grid-cols-1 items-center 
                    justify-center gap-2 bg-gray-50/20 rounded-none outline-none"
                disabled={gameField[position] !== ""
                  || props.activePlayer !== props.player
                  || gameFinished.value}
                key={position}
              >
                {props.player && gameField[position] === props.player
                  ? <Player1Icon playerIcon={props.playerIcon} />
                  : ""
                }
                {props.player2 && gameField[position] === props.player2
                  ? <Player2Icon playerIcon={props.playerIcon} />
                  : ""
                }
              </button>
            );
          })}
        </div>
        : <span> Waiting for player 2 {props.player2}</span>
      }
    </div>
  );
});