import { $, component$, useComputed$, useSignal } from "@builder.io/qwik";
import type { QRL } from "@builder.io/qwik";
import { GameField, OuterGameFieldPosition, Position } from "../../models/GameField.ts";
import TicTacToeCell from "./TicTacToeCell.tsx";
import { SetPositionData } from "../../models/SetPositionData.ts";
import Player1Icon from "./Player1Icon.tsx";
import Player2Icon from "./Player2Icon.tsx";
import { getAllowedOuterGameField } from "../../utils/getAllowedOuterGameField.ts";
import { socket } from "./Field.tsx";

interface ItemProps {
  player: any;
  player2: any;
  playerIcon: any;
  activePlayer: string;
  outerGameFieldPosition: OuterGameFieldPosition;
  room: string;
  gameField: GameField;
  gameReady: boolean;
  fieldWinner: string | null;
  disabled: boolean;
  setActivePlayer$: QRL<Function>;
  setPosition$: QRL<Function>;
  checkWinner$: QRL<Function>;
}

export default component$<ItemProps>((props) => {
  const gameFinished = useSignal(false);

  const sendPosition = $(async (pos: Position) => {
    const setPositionData: SetPositionData = {
      outerGameFieldPosition: props.outerGameFieldPosition,
      room: props.room,
      position: pos,
      allowedOuterGameField: getAllowedOuterGameField(pos),
    };
    props.setPosition$(props.outerGameFieldPosition, pos, props.player);
    socket.emit("set-position", setPositionData);
    if (await props.checkWinner$(props.outerGameFieldPosition)) {
      return;
    }
    props.setActivePlayer$(props.player2);
  });

  const computedClass = useComputed$(() => {
    const defaultClass = "grid grid-cols-3 grid-rows-3 w-full h-full max-w-[100%] md:border-2 border border-gray-300";

    return props.disabled ?
      `${defaultClass} cursor-not-allowed opacity-50 pointer-events-none`
      : defaultClass;
  });

  return (
    <div class="w-full h-full">
      <div class={computedClass}>
        {
          props.fieldWinner === null
          && (Object.keys(props.gameField) as Position[]).map((position: Position) => {
            return (
              <TicTacToeCell
                key={position}
                player={props.player}
                player2={props.player2}
                playerIcon={props.playerIcon}
                activePlayer={props.activePlayer}
                position={position}
                gameField={props.gameField}
                buttonClicked$={sendPosition}
                gameFinished={gameFinished.value}
              />
            );
          })
        }
        {
          props.player
          && props.player === props.fieldWinner
          && <Player1Icon playerIcon={props.playerIcon} size="w-full" wrapperClass="col-span-3 row-span-3 p-1" />
        }
        {
          props.player2
          && props.player2 === props.fieldWinner
          && <Player2Icon playerIcon={props.playerIcon} size="w-full" wrapperClass="col-span-3 row-span-3 p-1" />
        }

      </div>
    </div>
  );
});