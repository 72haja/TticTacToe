import { $, component$, useContextProvider, useSignal, useStore } from "@builder.io/qwik";

import { useNavigate } from "@builder.io/qwik-city";
import { io } from "socket.io-client";
import { v4 as uuid } from "uuid";
import "../app.css";
import { EnterGame } from "../components/enterGame/EnterGame";
import Snackbar from "../components/snackbar/Snackbar";
import type { SnackbarState } from "../store/SnackbarStore";
import { SnackbarCTX } from "../store/SnackbarStore";

// const URL = "https://ttictactoe-server.onrender.com";
const URL = "http://localhost:8080";
export const socket = io(URL);

socket.onAny((event, ...args) => {
  console.log("onAny", event, args);
});

socket.connect();

export default component$(() => {

  socket.onAny((event, ...args) => {
    console.log("inner any", event, args);
  });

  const nav = useNavigate();

  const room = useSignal("");

  const snackbarStore = useStore<SnackbarState>({
    show: false,
    text: "",
    timeout: 3000,
    type: "success",
    id: uuid(),
  });

  useContextProvider(SnackbarCTX, snackbarStore);

  const newGame = $(() => {
    room.value = uuid().replaceAll("-", "").slice(0, 8);

    nav(`/game/${room.value}`);
  })

  const enterGame = $((gameId: string) => {
    if (gameId.includes("http")) {
      gameId = gameId.split("/").pop() ?? "";
    }

    socket.emit("request-join", gameId);
  });

  socket.on("room-full", () => {
    snackbarStore.show = true;
    snackbarStore.text = "Room is full";
    snackbarStore.type = "error";
  });

  socket.on("joined", (roomId) => {
    snackbarStore.show = true;
    snackbarStore.text = "Joined game";
    snackbarStore.type = "success";

    room.value = roomId;
    nav(`/game/${roomId}`);
  });

  return (
    <div class="bg-gray-500 flex items-center justify-center w-full h-full p-12">
      <EnterGame
        newGame$={newGame}
        enterGame$={enterGame}
      />
      <Snackbar />
    </div>
  );
});
