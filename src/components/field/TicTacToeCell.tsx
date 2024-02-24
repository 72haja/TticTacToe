
import { component$ } from "@builder.io/qwik";
import { GameField, Position } from "../../models/GameField";
import Player1Icon from "./Player1Icon";
import Player2Icon from "./Player2Icon";

interface ItemProps {
  player: string;
  player2: string;
  playerIcon: string;
  activePlayer: string;
  position: Position;
  gameField: GameField;
  buttonClicked: Function;
  gameFinished: boolean;
}

export default component$<ItemProps>((props) => {
  return (
    <button
      onClick$={() => (props.buttonClicked(props.position))}
      class="w-full h-full border border-gray-600 grid grid-cols-1 items-center 
        justify-center gap-2 bg-gray-50/20 rounded-none outline-none"
      disabled={props.gameField[props.position] !== ""
        || props.activePlayer !== props.player
        || props.gameFinished}
      key={props.position}
    >
      {props.player && props.gameField[props.position] === props.player
        ? <Player1Icon playerIcon={props.playerIcon} />
        : ""
      }
      {props.player2 && props.gameField[props.position] === props.player2
        ? <Player2Icon playerIcon={props.playerIcon} />
        : ""
      }
    </button>
  );
});
