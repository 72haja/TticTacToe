import { v4 as uuid } from "uuid";
import { Game, GameField as GameFieldModel, OuterGameField as OuterGameFieldModel, OuterGameFieldPosition, Position } from "../../models/GameField";
import { ResetPlayerState } from "../../models/ResetPlayerState";
import { SetGameFieldData } from "../../models/SetGameFieldData";
import { SetPositionData } from "../../models/SetPositionData";
import { getAllowedOuterGameField } from "../../utils/getAllowedOuterGameField";
import { initOuterGameField } from "../../utils/initGameField";
import { socket } from "./Field";
import { GameField } from "./GameField";
import { VictoryDialog } from "./VictoryDialog";
import { useEffect, useState } from "react";
import { PlayerData } from "@/models/PlayerData";

interface ItemProps {
  player: any;
  player2: any;
  playerIcon: any;
  activePlayer: string;
  setActivePlayer: (player: string) => void;
  room: string;
  roomFull: boolean;
  setSnackbar: Function;
  onVictoryDialogClose: () => void;
}

export function OuterGameField(props: ItemProps) {
  const [gameReady, setGameReady]: [boolean, (gameReady: boolean) => void] = useState(false);
  const [gameFinished, setGameFinished]: [boolean, (gameFinished: boolean) => void] = useState(false);

  const [outerGameField, setOuterGameField]: [OuterGameFieldModel, (outerGameField: OuterGameFieldModel) => void] = useState(initOuterGameField());
  const [allowedOuterGameField, setAllowedOuterGameField]: [OuterGameFieldPosition | null, (allowedOuterGameField: OuterGameFieldPosition | null) => void] = useState(null as OuterGameFieldPosition | null);

  const [gameDraw, setGameDraw]: [boolean, (gameDraw: boolean) => void] = useState(false);


  useEffect(() => {
    if (!props.player2) return;

    if (props.player2 === "") {
      if (gameReady) {
        props.setSnackbar("Spieler 2 hat das Spiel verlassen", "error");
      }
      return
    }
    setGameReady(true);
    props.setSnackbar("Spieler 2 ist beigetreten", "success");
  }, [props.player2]);


  function setPosition(outerGameFieldPos: OuterGameFieldPosition, pos: Position, player: string) {
    const setPositionData: SetPositionData = {
      outerGameFieldPosition: outerGameFieldPos,
      room: props.room,
      position: pos,
      player,
    };
    socket.emit("set-position", setPositionData);
  };

  socket.on("set-game", (data: Game) => {
    resetGameStatus();
    setOuterGameField(data.gameFields);
    setAllowedOuterGameField(data.allowedOuterGameField);
    if (data.winner) {
      if(data.winner === "draw") {
        setGameDraw(true);
      } else {
        setGameFinished(true);
      }
      return;
    }
    props.setActivePlayer(data.activePlayer);
  })

  socket.on("join", (data: PlayerData) => {
    if(!data.game) return;
    setOuterGameField(data.game.gameFields);
  });

  socket.on("set-outer-game-fields", (outerGameField: OuterGameFieldModel) => {
    setOuterGameField(outerGameField);
  });

  function resetGameStatus() {
    setOuterGameField(initOuterGameField());
    setGameFinished(false);
    setGameDraw(false);
  };

  function onVictoryDialogClose() {
    setGameFinished(false);
    props.onVictoryDialogClose();
  }

  return (
    <div className="w-full h-full">
      {gameFinished
        && <VictoryDialog
          player={props.player}
          playerIcon={props.playerIcon}
          player2={props.player2}
          activePlayer={props.activePlayer}
          room={props.room}
          gameDraw={gameDraw}
          onVictoryDialogClose={onVictoryDialogClose}
        />
      }
      {
        props.roomFull
          ? <span> Room is full. Please try another room</span>
          : gameReady
            ? <div className="grid grid-cols-3 grid-rows-3 w-full h-full max-w-[100%]">
              {(Object.entries(outerGameField) as [
                OuterGameFieldPosition, { gameField: GameFieldModel }
              ][])
                .map(([outerGameFieldPosition, gameFieldObj]) => {
                  return (
                    <GameField
                      key={outerGameFieldPosition}
                      player={props.player}
                      player2={props.player2}
                      playerIcon={props.playerIcon}
                      activePlayer={props.activePlayer}
                      outerGameFieldPosition={outerGameFieldPosition}
                      room={props.room}
                      gameField={gameFieldObj.gameField}
                      gameReady={gameReady}
                      setPosition={setPosition}
                      fieldWinner={outerGameField[outerGameFieldPosition].fieldWinner}
                      disabled={!!allowedOuterGameField && allowedOuterGameField !== outerGameFieldPosition}
                    />
                  );
                })
              }
            </div>
            : <span> Waiting for player 2 {props.player2}</span>
      }
    </div>
  );
};
