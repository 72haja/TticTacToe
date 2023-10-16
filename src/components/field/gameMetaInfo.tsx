import { component$ } from "@builder.io/qwik";
import Player1Icon from "./Player1Icon";
import Player2Icon from "./Player2Icon";

interface ItemProps {
  playerIcon: string;
  activePlayer: string;
  player: string;
}

export default component$<ItemProps>((props) => {
  return (
    <div class="grid grid-cols-2 w-full">
      <div class="flex items-center gap-2 w-full h-[50px]">
        <span>Your Icon: </span>
        <Player1Icon
          playerIcon={props.playerIcon}
          size="h-full"
        />
      </div>
      <div class="flex items-center gap-2 w-full h-[50px]">
        <span>activePlayer: </span>
        {props.activePlayer === props.player
          ? <Player1Icon
            playerIcon={props.playerIcon}
            size="h-full"
          />
          : <Player2Icon
            playerIcon={props.playerIcon}
            size="h-full"
          />
        }
      </div>
    </div>
  );
});
