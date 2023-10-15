import { $, component$, useSignal } from "@builder.io/qwik";
import { io } from "socket.io-client";

export default component$(() => {
  const room = "room1";

  const socket = io("http://localhost:8080", {
    extraHeaders: {
      "room": room,
    },
  });

  const player = useSignal("");
  const player2 = useSignal("");

  socket.on("connection", (data) => {
    console.log("socket.on ~ data:", data);
    player.value = data;
    socket.emit("join", { player: data, room });
  });

  socket.on("join", (data) => {
    console.log("socket.on ~ join:", data, player.value);
    if (data.player !== player.value) {
      player2.value = data.player;
    }
    if (data.players?.length > 1) {
      data.players.find((playerEntry: string) => {
        if (playerEntry !== player.value) {
          player2.value = playerEntry;
          console.log("start game");
        }
      });
    }
  });
  // socket.on("game", (data) => {
  //   console.log("🚀 ~ file: field.tsx:8 ~ socket.on ~ data:", data);
  //   console.log(socket.id); // x8WIv7-mJelg7on_ALbx
  // });

  socket.on("player-left", (data) => {
    if (data.player === player2.value) {
      player2.value = "";
    }
    alert(`${data.player} left the game`);
  });

  const sendPosition = $((pos: Number) => {
    // socket.emit("game", { position: pos });
    console.log("pos:", pos);
  });

  return (
    <div class="w-full h-full flex flex-col gap-2">
      <div class="grid grid-cols-3 grid-rows-3 w-full h-full max-w-[100%] max-h-[100%] [&>button]:border [&>button]:border-gray-600 [&>button]:flex [&>button]:items-center [&>button]:justify-center [&>button]:bg-gray-50/20 [&>button]:rounded-none [&>button]:outline-none">
        <button onClick$={() => (sendPosition(1))}>1</button>
        <button onClick$={() => (sendPosition(2))}>2</button>
        <button onClick$={() => (sendPosition(3))}>3</button>
        <button onClick$={() => (sendPosition(4))}>4</button>
        <button onClick$={() => (sendPosition(5))}>5</button>
        <button onClick$={() => (sendPosition(6))}>6</button>
        <button onClick$={() => (sendPosition(7))}>7</button>
        <button onClick$={() => (sendPosition(8))}>8</button>
        <button onClick$={() => (sendPosition(9))}>9</button>
      </div>
      <span>
        player1.value: {player}
      </span>
      <span>
        player2.value: {player2.value}
      </span>
    </div>
  );
});
