import { $, component$, useSignal } from "@builder.io/qwik";
import { io } from "socket.io-client";
import GameMetaInfo from "./gameMetaInfo";
import ResponsiveFieldWrapper from "../responsiveFieldWrapper/responsiveFieldWrapper";
import GameField from "./gameField";


interface PlayerData {
  player: string;
  players?: string[];
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

console.log("socket", socket);
socket.connect();

socket.emit("self-join");

export default component$(() => {
  const player = useSignal("");
  const playerIcon = useSignal("");
  const player2 = useSignal("");
  const activePlayer = useSignal("");

  socket.on("self-join", (data: string) => {
    player.value = data;
    socket.emit("join", { player: data, room });
  });

  socket.on("join", (data: PlayerData) => {
    console.log("join");

    if (data.player !== player.value) {
      player2.value = data.player;
    }
  });

  socket.on("set-player2", (data: PlayerData) => {
    console.log("set-player2");
    player2.value = data.player;
    setActivePlayer(data.player);
  });

  socket.on("your-are-player1", () => {
    playerIcon.value = "CilCircle";
  })

  socket.on("your-are-player2", () => {
    playerIcon.value = "CilXCircle";
  })

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

  return (
    <div class="w-full h-full flex flex-col gap-2 items-center justify-center">
      <GameMetaInfo
        playerIcon={playerIcon.value}
        activePlayer={activePlayer.value}
        player={player.value}
      />
      <span>{player2.value}</span>
      <ResponsiveFieldWrapper>
        <GameField
          player={player.value}
          player2={player2.value}
          playerIcon={playerIcon.value}
          activePlayer={activePlayer.value}
          setActivePlayer={setActivePlayer}
          room={room}
        />
      </ResponsiveFieldWrapper>
    </div>
  );
});
