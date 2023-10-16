import { $, component$, useSignal, useStore } from "@builder.io/qwik";
import { io } from "socket.io-client";

interface SetPositionData {
  room: string;
  position: string;
}
interface PlayerData {
  player: string;
  players?: string[];
}

interface GameField {
  [position: string]: string;
}

const room = "room1";

const URL = "http://localhost:8080";
export const socket = io(URL, {
  extraHeaders: {
    "room": room,
  },
});

socket.onAny((event, ...args) => {
  console.log(event, args);
});

socket.emit("self-join");

export default component$(() => {
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

  const player = useSignal("");
  const player2 = useSignal("");
  const activePlayer = useSignal("");

  socket.on("self-join", (data: string) => {
    player.value = data;
    socket.emit("join", { player: data, room });
  });

  const checkAndReplaceOldPlayerInField = $(async (newPlayer: string) => {
    const fieldsOfOldPlayer = Object.keys(gameField).filter(
      (position: string) => {
        return gameField[position] !== "" &&
          gameField[position] !== player.value;
      },
    );
    fieldsOfOldPlayer.forEach((position: string) => {
      gameField[position] = newPlayer;
    });
    if (fieldsOfOldPlayer.length > 0) {
      socket.emit("set-game-field", { room, gameField });
    }
  });

  socket.on("join", (data: PlayerData) => {
    console.log("join");

    if (data.player !== player.value) {
      player2.value = data.player;
      console.log("player2");
      checkAndReplaceOldPlayerInField(data.player);
    }
  });

  socket.on("set-player2", (data: PlayerData) => {
    console.log("set-player2");
    player2.value = data.player;
    setActivePlayer(data.player);
  });

  const setActivePlayer = $((player: string) => {
    activePlayer.value = player;
    socket.emit("set-active-player", { player, room });
  });

  socket.on("set-active-player", (player: string) => {
    activePlayer.value = player;
  });

  socket.on("set-game-field", (tmpGameField: GameField) => {
    Object.keys(tmpGameField).forEach((position: string) => {
      gameField[position] = tmpGameField[position];
    });
  });

  socket.on("player-left", (data: PlayerData) => {
    if (data.player === player2.value) {
      player2.value = "";
    }
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
      console.log(`${activePlayer.value} wins!`);
    }
    return won;
  });

  const sendPosition = $(async (pos: string) => {
    const setPositionData: SetPositionData = {
      room,
      position: pos,
    };
    gameField[pos] = player.value;
    socket.emit("set-position", setPositionData);
    if (await checkWinner()) {
      return;
    }
    setActivePlayer(player2.value);
  });

  socket.on("set-position", (data: any) => {
    gameField[data.position] = player2.value;
    checkWinner();
  });

  return (
    <div class="w-full h-full flex flex-col gap-2">
      <span>
        activePlayer: {activePlayer.value}
      </span>
      <div class="grid grid-cols-3 grid-rows-3 w-full h-full max-w-[100%] max-h-[100%] [&>button]:border [&>button]:border-gray-600 [&>button]:flex [&>button]:items-center [&>button]:justify-center [&>button]:bg-gray-50/20 [&>button]:rounded-none [&>button]:outline-none">
        {Object.keys(gameField).map((position: string) => {
          return (
            <button
              onClick$={() => (sendPosition(position))}
              class="w-full h-full flex flex-col gap-2"
              disabled={gameField[position] !== "" ||
                activePlayer.value !== player.value}
              key={position}
            >
              <span>{gameField[position]}</span>
              <span>{position}</span>
            </button>
          );
        })}
      </div>
      <span>
        player1.value: {player.value}
      </span>
      <span>
        player2.value: {player2.value}
      </span>
    </div>
  );
});
