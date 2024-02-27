import { $, component$, useContextProvider, useSignal, useStore, useTask$ } from "@builder.io/qwik";

import { v4 as uuid } from "uuid";
import "./app.css";
import { EnterGame } from "./components/enterGame/EnterGame.tsx";
import Field, { socket } from "./components/field/Field.tsx";
import Snackbar from "./components/snackbar/Snackbar.tsx";
import { SnackbarCTX, SnackbarState } from "./store/SnackbarStore.ts";

export const App = component$(() => {

  const room = useSignal("");

  const snackbarStore = useStore<SnackbarState>({
    show: false,
    text: "",
    timeout: 3000,
    type: "success",
    id: uuid(),
  });

  useContextProvider(SnackbarCTX, snackbarStore);


  useTask$(() => {
    room.value = window.location.pathname.replace("/", "") ?? "";
  });

  const newGame = $(() => {
    room.value = uuid().replaceAll("-", "").slice(0, 8);
    window.history.pushState({}, "", `/${room.value}`);
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

  socket.on("room-not-found", () => {
    snackbarStore.show = true;
    snackbarStore.text = "Room not found";
    snackbarStore.type = "error";
  });

  socket.on("joined", (roomId) => {
    snackbarStore.show = true;
    snackbarStore.text = "Joined game";
    snackbarStore.type = "success";

    room.value = roomId;
    window.history.pushState({}, "", `/${roomId}`);
  });

  window.addEventListener('popstate', function () {
    room.value = window.location.pathname.replace("/", "") ?? "";
  });

  return (
    <>
      <div class="bg-gray-500 flex items-center justify-center w-full h-full p-12">
        {
          room.value.length > 0
            ? (<Field room={room.value} />)
            : (<EnterGame
              newGame={newGame}
              enterGame={enterGame}
            />)
        }
        <Snackbar />
      </div>
    </>
  );
});
