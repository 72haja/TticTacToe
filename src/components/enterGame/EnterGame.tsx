import { component$, useComputed$, useSignal } from "@builder.io/qwik";

type EnterGameProps = {
  newGame: Function;
  enterGame: Function;
};

export const EnterGame = component$<EnterGameProps>((props) => {

  const gameId = useSignal("");

  const defaultBtnClass = "w-full h-full md:border border-[0.5px] border-gray-600 grid grid-cols-1 items-center justify-center gap-2 bg-gray-600 active:bg-gray-700 rounded-lg outline-none px-2"
  const disabledBtnClass = useComputed$(() => {
    return gameId.value.length > 0
      ? defaultBtnClass
      : `${defaultBtnClass} cursor-not-allowed opacity-50 pointer-events-none`
  })

  return (
    <div class="p-4 2xl:p-10 flex flex-col gap-10 w-full items-center">
      <h1 class="text-4xl 2xl:text-6xl text-center">T -Tic Tac Toe</h1>
      <div class="flex flex-col gap-4 items-stretch w-full md:w-[500px]">
        <button class={defaultBtnClass}
          onClick$={() => props.newGame()}
        >
          <span class="text-2xl 2xl:text-4xl text-center">Neues Spiel</span>
        </button>
        <div class="grid grid-cols-[1fr_max-content_1fr] gap-2 items-center">
          <div class="h-[0.5px] bg-gray-600" />
          <span class="text-gray-300">oder</span>
          <div class="h-[0.5px] bg-gray-600" />
        </div>

        <input
          type="text"
          class="p-4 md:outline outline-[0.5px] outline-gray-600 active:outline-2 hover:outline-gray-700
            focus-within:outline-2 focus-within:outline-gray-700 rounded-lg bg-gray-300 text-gray-700 
            placeholder:text-gray-500"
          placeholder="Spiele-ID/Url eingeben"
          onInput$={(e) => gameId.value = (e.target as HTMLInputElement).value}
        />

        <button class={disabledBtnClass}
          onClick$={() => props.enterGame(gameId.value)}
        >
          <span class="text-2xl 2xl:text-4xl text-center">Spiel beitreten</span>
        </button>
      </div>
    </div>
  );
});