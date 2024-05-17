import { useEffect, useState } from "react";

type EnterGameProps = {
  newGame: () => void;
  enterGame: (gameId: string) => void;
};

export function EnterGame(props: EnterGameProps) {
  const [gameId, setGameId]: [string, (gameId: string) => void] = useState("");

  const defaultBtnClass = "w-full h-full md:border border-[0.5px] border-gray-600 items-center justify-center bg-gray-600 active:bg-gray-700 rounded-lg outline-none px-2"
  const [disabledBtnClass, setDisabledBtnClass]: [
    string, 
    (disabledBtnClass: string) => void,
  ] = useState(`${defaultBtnClass} cursor-not-allowed opacity-50 pointer-events-none`);

  useEffect(() => {
    setDisabledBtnClass(
      gameId.length > 0
        ? defaultBtnClass
        : `${defaultBtnClass} cursor-not-allowed opacity-50 pointer-events-none`
    );
  }, [gameId]);

  return (
    <div className="p-4 2xl:p-10 flex flex-col gap-10 w-full items-center">
      <h1 className="text-4xl 2xl:text-6xl text-center">T - Tic Tac Toe</h1>
      <div className="flex flex-col gap-4 items-stretch w-full md:w-[500px]">
        <button className={defaultBtnClass}
          onClick={() => props.newGame()}
        >
          <span className="text-2xl 2xl:text-4xl text-center">Neues Spiel</span>
        </button>
        <div className="grid grid-cols-[1fr_max-content_1fr] gap-2 items-center">
          <div className="h-[0.5px] bg-gray-600" />
          <span className="text-gray-300">oder</span>
          <div className="h-[0.5px] bg-gray-600" />
        </div>

        <input
          type="text"
          className="p-4 md:outline outline-[0.5px] outline-gray-600 active:outline-2 hover:outline-gray-700
            focus-within:outline-2 focus-within:outline-gray-700 rounded-lg bg-gray-300 text-gray-700 
            placeholder:text-gray-500"
          placeholder="Spiele-ID/Url eingeben"
          onInput={(e) => setGameId((e.target as HTMLInputElement).value)}
        />

        <button className={disabledBtnClass}
          onClick={() => props.enterGame(gameId)}
        >
          <span className="text-2xl 2xl:text-4xl text-center">Spiel beitreten</span>
        </button>
      </div>
    </div>
  );
};