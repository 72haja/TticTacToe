import { useEffect, useState } from "react";
import { GameField as GameFieldModel, OuterGameFieldPosition, Position } from "../../models/GameField";
import { SetPositionData } from "../../models/SetPositionData";
import { getAllowedOuterGameField } from "../../utils/getAllowedOuterGameField";
import { socket } from "./Field";
import { Player1Icon } from "./Player1Icon";
import { Player2Icon } from "./Player2Icon";
import { TicTacToeCell } from "./TicTacToeCell";

interface ItemProps {
  player: any;
  player2: any;
  playerIcon: any;
  activePlayer: string;
  outerGameFieldPosition: OuterGameFieldPosition;
  room: string;
  gameField: GameFieldModel;
  gameReady: boolean;
  fieldWinner: string | null;
  disabled: boolean;
  setActivePlayer: Function;
  setPosition: Function;
  checkWinner: Function;
}

export function GameField(props: ItemProps) {
  // const gameFinished = useSignal(false);
  const [gameFinished, setGameFinished]: [boolean, (gameFinished: boolean) => void] = useState(false);

  async function sendPosition(pos: Position) {
    const setPositionData: SetPositionData = {
      outerGameFieldPosition: props.outerGameFieldPosition,
      room: props.room,
      position: pos,
      allowedOuterGameField: getAllowedOuterGameField(pos),
    };
    props.setPosition(props.outerGameFieldPosition, pos, props.player);
    socket.emit("set-position", setPositionData);
    if (await props.checkWinner(props.outerGameFieldPosition)) {
      return;
    }
    props.setActivePlayer(props.player2);
  };

  const defaultClass = "grid grid-cols-3 grid-rows-3 w-full h-full max-w-[100%] md:border-2 border border-gray-300";
  const [computedClass, setComputedClass]: [string, (computedClass: string) => void] = useState(
    defaultClass
  );

  useEffect(() => {
    if (props.disabled) {
      setComputedClass(`${defaultClass} cursor-not-allowed opacity-50 pointer-events-none`);
    } else {
      setComputedClass(defaultClass);
    }
  }, [props.disabled]);

  return (
    <div className="w-full h-full">
      <div className={computedClass}>
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
                buttonClicked={sendPosition}
                gameFinished={gameFinished}
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
};