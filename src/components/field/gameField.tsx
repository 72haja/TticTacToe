import { $, component$, useSignal } from "@builder.io/qwik";
import { GameField, OuterGameFieldPosition, Position } from "../../models/GameField.ts";
import { socket } from "./Field.tsx";
import TicTacToeCell from "./TicTacToeCell.tsx";

interface ItemProps {
  player: any;
  player2: any;
  playerIcon: any;
  activePlayer: string;
  setActivePlayer: Function;
  outerGameFieldPosition: OuterGameFieldPosition;
  room: string;
  gameField: GameField;
  setPosition: Function;
  gameReady: boolean;
  checkWinner: Function;
}

type SetPositionData = {
  room: string;
  position: Position;
}

export default component$<ItemProps>((props) => {
  const gameFinished = useSignal(false);

  const sendPosition = $(async (pos: Position) => {
    const setPositionData: SetPositionData = {
      room: props.room,
      position: pos,
    };
    props.setPosition(pos, props.player);
    socket.emit("set-position", setPositionData);
    if (await props.checkWinner()) {
      return;
    }
    props.setActivePlayer(props.player2);
  });

  return (
    <div class="w-full h-full">
      {props.gameReady
        ? <div class="grid grid-cols-3 grid-rows-3 w-full h-full max-w-[100%]">
          {(Object.keys(props.gameField) as Position[]).map((position: Position) => {
            return (
              <TicTacToeCell
                player={props.player}
                player2={props.player2}
                playerIcon={props.playerIcon}
                activePlayer={props.activePlayer}
                position={position}
                gameField={props.gameField}
                buttonClicked={sendPosition}
                gameFinished={gameFinished.value}
              />
            );
          })}
        </div>
        : <span> Waiting for player 2 {props.player2}</span>
      }
    </div>
  );
});