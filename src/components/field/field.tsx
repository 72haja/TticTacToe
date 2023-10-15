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

const sessionStoredSocketId = sessionStorage.getItem("socketId")
  ? sessionStorage.getItem("socketId")
  : "";

const room = "room1";

export const socket = io("http://localhost:8080", {
  extraHeaders: {
    "room": room,
  },
});

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

  socket.on("connection", (data: string) => {
    console.log("socket.on ~ data:", data);
    player.value = data;
    sessionStorage.setItem("socketId", data);
    socket.emit("join", { player: data, room });
  });

  socket.on("join", (data: PlayerData) => {
    console.log("socket.on ~ join:", data, player.value);
    if (data.player !== player.value) {
      player2.value = data.player;
    }
    if (data.players && data.players.length > 1) {
      data.players.find((playerEntry: string) => {
        if (playerEntry !== player.value) {
          player2.value = playerEntry;
          setActivePlayer(playerEntry);
        }
      });
    }
  });

  const setActivePlayer = $((player: string) => {
    activePlayer.value = player;
    socket.emit("set-active-player", { player, room });
  });

  socket.on("set-active-player", (player: string) => {
    activePlayer.value = player;
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
