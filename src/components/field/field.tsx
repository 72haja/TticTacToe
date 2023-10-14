import { component$, useTask$, useStore, useComputed$ } from "@builder.io/qwik";

export default component$(() => {
  const store = useStore({
    squareContainerStyle: {
      width: "10px",
      height: "10px",
    },
    squareStyle: {
      width: "10px",
      height: "10px",
    },
  });

  const squareContainerStyle = useComputed$(() => {
    return {
      width: store.squareContainerStyle.width,
      height: store.squareContainerStyle.height,
    };
  });

  const squareStyle = useComputed$(() => {
    return {
      width: store.squareStyle.width,
      height: store.squareStyle.height,
    };
  });

  function resizeSquare() {
    var sideLength = Math.min(window.innerWidth, window.innerHeight) * 0.8;
    store.squareStyle.width = sideLength + "px";
    store.squareStyle.height = sideLength + "px";
    store.squareContainerStyle.width = window.innerWidth + "px";
    store.squareContainerStyle.height = window.innerHeight + "px";
  }

  window.addEventListener("resize", resizeSquare);
  window.addEventListener("load", resizeSquare); // Ensure the square is sized correctly on initial load

  useTask$(async () => {
    //resizeSquare();
  });

  return (
    <div class="w-full h-full flex flex-col gap-5 bg-red-100">
      <div
        id="square-container"
        class="border border-black flex items-center justify-center "
        bind:style={squareContainerStyle}
      >
        <div
          id="square"
          class="grid grid-cols-3 grid-rows-3 w-full h-full max-w-[100%] max-h-[100%] [&>div]:border [&>div]:border-black [&>div]:flex [&>div]:items-center [&>div]:justify-center"
          bind:style={squareStyle}
        >
          <div>1</div>
          <div>2</div>
          <div>3</div>
          <div>1</div>
          <div>2</div>
          <div>3</div>
          <div>1</div>
          <div>2</div>
          <div>3</div>
        </div>
      </div>
    </div>
  );
});
