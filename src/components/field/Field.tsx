import { io } from "socket.io-client";
import { GameMetaInfo } from "./GameMetaInfo";
import { ResponsiveFieldWrapper } from "../responsiveFieldWrapper/ResponsiveFieldWrapper";
import { OuterGameField } from "./OuterGameField";
import { ResetPlayerState } from "../../models/ResetPlayerState";
import { IconName } from "../../models/IconName";
import { PlayerData } from "../../models/PlayerData";
import { useState } from "react";


const room = "room1";

// const URL = "https://ttictactoe-server.onrender.com";
const URL = "http://localhost:8080";
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

type FieldProps = {
  setSnackbar: Function;
};

export function Field(props: FieldProps) {
  const [player, setPlayer]: [string, (player: string) => void] = useState("");
  const [playerIcon, setPlayerIcon]: [IconName, (icon: IconName) => void] = useState("CilCircle" as IconName);
  const [player2, setPlayer2]: [string, (player: string) => void] = useState("");
  const [activePlayer, setActivePlayer]: [string, (player: string) => void] = useState("");

  const [activePlayerAfterPlayerLeft, setActivePlayerAfterPlayerLeft]: [IconName | "", (player: IconName | "") => void] = useState("" as IconName | "");

  socket.on("self-join", (data: string) => {
    // player.value = data;
    setPlayer(data);
    const joinData: PlayerData = { player: data, room };
    socket.emit("join", joinData);
  });

  socket.on("join", (data: PlayerData) => {
    if (data.player === player) return;

    setPlayer2(data.player);
  });

  const [roomFull, setRoomFull]: [boolean, (roomFull: boolean) => void] = useState(false);
  socket.on("room-full", () => {
    setRoomFull(true);
  });

  socket.on("set-player2", (data: PlayerData) => {
    // player2.value = data.player;
    setPlayer2(data.player);
    setActivePlayerFnk(data.player);
  });

  socket.on("your-are-player1", () => {
    setPlayerIcon("CilCircle");
  })

  socket.on("your-are-player2", () => {
    setPlayerIcon("CilXCircle");
  })

  socket.on("reset-player-state", (data: ResetPlayerState) => {
    // playerIcon.value = data.iconFromOtherPlayer === "CilXCircle"
    const newPlayerIcon = data.iconFromOtherPlayer === "CilXCircle"
      ? "CilCircle"
      : "CilXCircle";
    setPlayerIcon(newPlayerIcon);

    setActivePlayer(data.activePlayer);
  })

  function setActivePlayerFnk(player: string) {
    setActivePlayer(player);
    socket.emit("set-active-player", { player, room });
  };

  socket.on("set-active-player", (playerProp: string) => {
    if (activePlayerAfterPlayerLeft !== "") {
      const oldActivePlayer = playerIcon === activePlayerAfterPlayerLeft
        ? player
        : player2;
      setActivePlayerFnk(oldActivePlayer);
      setActivePlayerAfterPlayerLeft("");
      return;
    } else {
      setActivePlayer(playerProp);
    }
  });

  socket.on("player-left", (data: PlayerData) => {
    if (data.player !== player2) return

    setPlayer2("");
    const activePlayerIcon: IconName = activePlayer === player
      ? playerIcon === "CilXCircle" ? "CilXCircle" : "CilCircle"
      : playerIcon === "CilXCircle" ? "CilCircle" : "CilXCircle"

    setActivePlayerAfterPlayerLeft(activePlayerIcon);
  });

  return (
    <div className="w-full h-full flex flex-col gap-2 items-center justify-center">
      <GameMetaInfo
        playerIcon={playerIcon}
        activePlayer={activePlayer}
        player={player}
      />
      <ResponsiveFieldWrapper>
        <OuterGameField
          player={player}
          player2={player2}
          playerIcon={playerIcon}
          activePlayer={activePlayer}
          setActivePlayer={setActivePlayerFnk}
          room={room}
          roomFull={roomFull}
          setSnackbar={props.setSnackbar}
        />
      </ResponsiveFieldWrapper>
    </div>
  );
};
