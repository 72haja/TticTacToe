import {
  $,
  component$,
  useComputed$,
  useSignal,
  useStore,
  useTask$,
} from "@builder.io/qwik";
import Field from "../field/field";

export default component$(() => {
  const fieldRef = useSignal<Element>();

  const store = useStore({
    squareContainerStyle: {
      width: "0px",
      height: "0px",
    },
    squareStyle: {
      width: "0px",
      height: "0px",
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

  const resizeSquare = $(() => {
    var sideLength = Math.min(window.innerWidth, window.innerHeight) * 0.8;
    store.squareStyle.width = sideLength + "px";
    store.squareStyle.height = sideLength + "px";
    store.squareContainerStyle.width = window.innerWidth + "px";
    store.squareContainerStyle.height = window.innerHeight + "px";
  });

  window.addEventListener("resize", resizeSquare);
  window.addEventListener("load", resizeSquare); // Ensure the square is sized correctly on initial load

  useTask$(({ track }) => {
    resizeSquare();
  });

  return (
    <div class="w-full h-full flex flex-col gap-5 bg-gray-500">
      <div
        id="square-container"
        class="border border-black flex items-center justify-center "
        bind:style={squareContainerStyle}
      >
        <div id="square" bind:style={squareStyle}>
          <Field ref={fieldRef} />
        </div>
      </div>
    </div>
  );
});
