import { $, component$ } from "@builder.io/qwik";
import Player1Icon from "./Player1Icon";
import Player2Icon from "./Player2Icon";

import { socket } from "./Field.tsx";

interface ItemProps {
  playerIcon: string;
  player: string;
  activePlayer: string;
  player2: string;
  room: string;
  onNewGame: Function;
}

export default component$<ItemProps>((props) => {

  const emitNewGame = $(() => {
    socket.emit("new-game", props.room);

    
    const nextActivePlayer = props.activePlayer === props.player
    ? props.player2
    : props.player;
    
    socket.emit("set-active-player", {
      player: nextActivePlayer,
      room: props.room,
    });

    props.onNewGame(nextActivePlayer);
  });

  return (
    <div class="absolute top-0 left-0 z-10 w-full h-full flex items-center justify-center">
      <div class="grid md:grid-cols-[max-content_1fr_max-content] grid-cols-[1fr_max-content] items-center h-max gap-4 w-full max-w-md p-4 rounded-xl bg-green-800 text-white shadow-lg">
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
          class="bg-white text-green-800 rounded-lg p-2 md:columns-1 columns-2"
        >
          Neues Spiel
        </button>
      </div>
    </div>
  )
});