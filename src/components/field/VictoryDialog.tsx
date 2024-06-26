import { CilXCircle } from "../icons/icons";
import { socket } from "../../pages/game/[id]";
import {Player1Icon} from "./Player1Icon";
import {Player2Icon} from "./Player2Icon";

interface ItemProps {
  playerIcon: string;
  player: string;
  activePlayer: string;
  player2: string;
  room: string;
  gameDraw: boolean;
  onVictoryDialogClose: () => void;
}

export function VictoryDialog(props: ItemProps) {
  function emitNewGame() {
    socket.emit("new-game", props.room);
  };

  const winnerIcon = !props.gameDraw && props.activePlayer === props.player
    ? <Player1Icon
      playerIcon={props.playerIcon}
      size="w-[60px]"
    />
    : !props.gameDraw && <Player2Icon
      playerIcon={props.playerIcon}
      size="w-[60px]"
    />

  return (
    <div className="absolute top-0 left-0 z-10 w-full h-full flex items-center justify-center">
      <div className="relative grid md:grid-cols-[max-content_1fr_max-content] grid-cols-[max-content_1fr] items-center h-max gap-4 w-full max-w-md p-4 rounded-xl bg-green-800 text-white shadow-lg">
        <button
          onClick={props.onVictoryDialogClose}
          className="bg-green-700 rounded-full absolute -top-3 -right-3 p-1 w-8 h-8 flex items-center justify-center"
        >
          <CilXCircle className="w-full h-full" />
        </button>

        {props.gameDraw
          && <span>Unentschieden</span>
        }

        {!props.gameDraw
          && <span>Gewonnen hat Spieler: </span>
        }

        {winnerIcon}
        <button
          onClick={() => emitNewGame()}
          className="bg-white text-green-800 rounded-lg p-2 md:col-span-1 col-span-2"
        >
          Neues Spiel
        </button>
      </div>
    </div>
  )
};
