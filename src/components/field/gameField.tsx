import { $, component$, useSignal } from "@builder.io/qwik";
import { GameField, OuterGameFieldPosition, Position } from "../../models/GameField.ts";
import { socket } from "./Field.tsx";
import TicTacToeCell from "./TicTacToeCell.tsx";
import { SetPositionData } from "../../models/SetPositionData.ts";
import Player1Icon from "./Player1Icon.tsx";
import Player2Icon from "./Player2Icon.tsx";

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
  fieldWinner: string | null;
}

export default component$<ItemProps>((props) => {
  const gameFinished = useSignal(false);

  const sendPosition = $(async (pos: Position) => {
    const setPositionData: SetPositionData = {
      outerGameFieldPosition: props.outerGameFieldPosition,
      room: props.room,
      position: pos,
    };
    props.setPosition(props.outerGameFieldPosition, pos, props.player);
    socket.emit("set-position", setPositionData);
    if (await props.checkWinner(props.outerGameFieldPosition)) {
      return;
    }
    props.setActivePlayer(props.player2);
  });

  return (
    <div class="w-full h-full">
      {props.gameReady
        ? <div class="grid grid-cols-3 grid-rows-3 w-full h-full max-w-[100%] border-2
            border-gray-300">
          {
            props.fieldWinner === null 
              && (Object.keys(props.gameField) as Position[]).map((position: Position) => {
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
              })
          }
          { 
            props.player 
            && props.player === props.fieldWinner
            && <Player1Icon playerIcon={props.playerIcon} size="w-full" wrapperClass="col-span-3 row-span-3 p-1"/>
          }
          {
            props.player2
            && props.player2 === props.fieldWinner
            && <Player2Icon playerIcon={props.playerIcon} size="w-full" wrapperClass="col-span-3 row-span-3 p-1" />
          }

        </div>
        : <span> Waiting for player 2 {props.player2}</span>
      }
    </div>
  );
});