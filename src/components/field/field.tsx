import { $, Signal, component$, useSignal } from "@builder.io/qwik";
import { io } from "socket.io-client";
import GameMetaInfo from "./GameMetaInfo";
import ResponsiveFieldWrapper from "../responsiveFieldWrapper/ResponsiveFieldWrapper";
import OuterGameField from "./OuterGameField";
import { ResetPlayerState } from "../../models/ResetPlayerState";
import { IconName } from "../../models/IconName";


interface PlayerData {
  player: string;
  players?: string[];
}

const room = "room1";

const URL = "http://192.168.10.210:8080";
export const socket = io(URL, {
  extraHeaders: {
    "room": room,
  },
});

socket.onAny((event, ...args) => {
  console.log("onAny", event, args);
});

socket.connect();

socket.emit("self-join");

export default component$(() => {
  const player = useSignal("");
  const playerIcon: Signal<IconName> = useSignal("CilCircle");
  const player2 = useSignal("");
  const activePlayer = useSignal("");

  const activePlayerAfterPlayerLeft: Signal<IconName | ""> = useSignal("");

  socket.on("self-join", (data: string) => {
    player.value = data;
    socket.emit("join", { player: data, room });
  });

  socket.on("join", (data: PlayerData) => {
    if (data.player === player.value) return;

    player2.value = data.player;
  });

  socket.on("set-player2", (data: PlayerData) => {
    player2.value = data.player;
    setActivePlayer(data.player);
  });

  socket.on("your-are-player1", () => {
    playerIcon.value = "CilCircle";
  })

  socket.on("your-are-player2", () => {
    playerIcon.value = "CilXCircle";
  })

  socket.on("reset-player-state", (data: ResetPlayerState) => {
    playerIcon.value = data.iconFromOtherPlayer === "CilXCircle"
      ? "CilCircle"
      : "CilXCircle";

    activePlayer.value = data.activePlayer
  })

  const setActivePlayer = $((player: string) => {
    activePlayer.value = player;
    socket.emit("set-active-player", { player, room });
  });

  socket.on("set-active-player", (playerProp: string) => {
    if (activePlayerAfterPlayerLeft.value !== "") {
      const oldActivePlayer = playerIcon.value === activePlayerAfterPlayerLeft.value
        ? player.value
        : player2.value;
      setActivePlayer(oldActivePlayer);
      activePlayerAfterPlayerLeft.value = "";
      return;
    } else {
      activePlayer.value = playerProp;
    }
  });

  socket.on("player-left", (data: PlayerData) => {
    if (data.player !== player2.value) return

    player2.value = "";
    const activePlayerIcon: IconName = activePlayer.value === player.value
      ? playerIcon.value === "CilXCircle" ? "CilXCircle" : "CilCircle"
      : playerIcon.value === "CilXCircle" ? "CilCircle" : "CilXCircle"

    activePlayerAfterPlayerLeft.value = activePlayerIcon
  });

  return (
    <div class="w-full h-full flex flex-col gap-2 items-center justify-center">
      <GameMetaInfo
        playerIcon={playerIcon.value}
        activePlayer={activePlayer.value}
        player={player.value}
      />
      <ResponsiveFieldWrapper>
        <OuterGameField
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
