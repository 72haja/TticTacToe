import { $, component$ } from "@builder.io/qwik";
import Player1Icon from "./Player1Icon";
import Player2Icon from "./Player2Icon";

import { socket } from "./Field.tsx";

interface ItemProps {
  playerIcon: string;
  player: string;
  activePlayer: string;
  room: string;
  onNewGame: Function;
}

export default component$<ItemProps>((props) => {

  const emitNewGame = $(() => {
    socket.emit("new-game", props.room);

    props.onNewGame();
  });

  return (
    <div class="absolute z-10 w-full h-full flex items-center justify-center">
      <div class="grid grid-cols-[max-content_1fr_max-content] items-center h-max gap-4 w-full max-w-md p-4 rounded-xl bg-green-800 text-white shadow-lg">
        <span>Gewonnen hat Spieler: </span>
        {props.activePlayer === props.player
          ? <Player1Icon
            playerIcon={props.playerIcon}
            size="w-[60px]"
            />
            : <Player2Icon
            playerIcon={props.playerIcon}
            size="w-[60px]"
          />
        }
        <button
          onClick$={() => emitNewGame()}
          class="bg-white text-green-800 rounded-lg p-2"
        >
          Neues Spiel
        </button>
      </div>
    </div>
  )
});
