import {Player1Icon} from "./Player1Icon";
import {Player2Icon} from "./Player2Icon";

import "./gameMetaInfo.css";

interface ItemProps {
  playerIcon: string;
  activePlayer: string;
  player: string;
}

export function GameMetaInfo(props: ItemProps) {
  return (
    <div className="grid grid-cols-2 w-full" id="meta-game-info-wrapper">
      <div className="flex items-center gap-2 w-full lg:h-[50px] md:h-[50px] sm:h-[35px] h-[25px]">
        <span className="whitespace-nowrap">Your Icon: </span>
        <Player1Icon
          playerIcon={props.playerIcon}
          size="h-full"
        />
      </div>
      <div className="flex items-center gap-2 w-full lg:h-[50px] md:h-[50px] sm:h-[35px] h-[25px]">
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
};
