import { io } from "socket.io-client";
import { GameMetaInfo } from "./GameMetaInfo";
import { ResponsiveFieldWrapper } from "../responsiveFieldWrapper/ResponsiveFieldWrapper";
import { OuterGameField } from "./OuterGameField";
import { ResetPlayerState } from "../../models/ResetPlayerState";
import { IconName } from "../../models/IconName";
import { PlayerData } from "../../models/PlayerData";
import { useEffect, useState } from "react";


const URL = "https://ttictactoe-server.onrender.com";
// const URL = "http://localhost:8080";
// const URL = "https://ttic-tac-toe-server.vercel.app";
export const socket = io(URL);

// socket.onAny((event, ...args) => {
//   console.log("onAny", event, args);
// });

// socket.connect();


type FieldProps = {
  setSnackbar: Function;
  room: string;
};

export function Field(props: FieldProps) {
  const [isConnected, setIsConnected] = useState(socket.connected);
  
  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }
    
    function onDisconnect() {
      setIsConnected(false);
    }
    
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    if (props.room) {
      socket.emit("self-join", props.room);
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  useEffect(() => {
    if (props.room) {
      socket.emit("self-join", props.room);
    }
  }, [props.room]);

  const [player, setPlayer]: [string, (player: string) => void] = useState("");
  const [playerIcon, setPlayerIcon]: [IconName, (icon: IconName) => void] = useState("CilCircle" as IconName);
  const [player2, setPlayer2]: [string, (player: string) => void] = useState("");
  const [activePlayer, setActivePlayer]: [string, (player: string) => void] = useState("");

  socket.on("self-join", (data: PlayerData) => {
    setPlayer(data.player);
    const joinData: PlayerData = { player: data.player, room: props.room };
    socket.emit("join", joinData);
  });

  socket.on("join", (data: PlayerData) => {
    if (data.gameRoom[0] === player) {
      yourArePlayer1();
      setPlayer2(data.gameRoom[1]);
      return;
    } else if (data.gameRoom[1] === player) {
      yourArePlayer2();
      setPlayer2(data.gameRoom[0]);
      return;
    }
    if(!data.game) return;
    setActivePlayer(data.game.activePlayer);
  });

  const [roomFull, setRoomFull]: [boolean, (roomFull: boolean) => void] = useState(false);
  socket.on("room-full", () => {
    setRoomFull(true);
  });

  socket.on("set-player2", (data: PlayerData) => {
    setPlayer2(data.player);
  });

  function yourArePlayer1() {
    setPlayerIcon("CilCircle");
  }

  function yourArePlayer2() {
    setPlayerIcon("CilXCircle");
  }

  socket.on("player-left", (data: PlayerData) => {
    if (data.player !== player2) return

    setPlayer2("");
  });

  const [showNewGameButton, setShowNewGameButton]: [boolean, (showNewGameButton: boolean) => void] = useState(false);
  function onVictoryDialogClose() {
    setShowNewGameButton(true);
  }

  function newGame() {
    socket.emit("new-game", props.room);
    setShowNewGameButton(false);
  }

  return (
    <div className="w-full h-full flex flex-col gap-2 items-center justify-center">
      <GameMetaInfo
        playerIcon={playerIcon}
        activePlayer={activePlayer}
        player={player}
      />
      <ResponsiveFieldWrapper>
        <div className="w-full h-full flex flex-col gap-4">
          <OuterGameField
            player={player}
            player2={player2}
            playerIcon={playerIcon}
            activePlayer={activePlayer}
            setActivePlayer={setActivePlayer}
            room={props.room}
            roomFull={roomFull}
            setSnackbar={props.setSnackbar}
            onVictoryDialogClose={onVictoryDialogClose}
          />
          {showNewGameButton
            && <button
              onClick={() => newGame()}
              className="bg-white text-green-800 rounded-lg p-2 md:col-span-1 col-span-2 max-w-72"
            >
              Neues Spiel
            </button>
          }
        </div>
      </ResponsiveFieldWrapper>
    </div>
  );
};
