import { Slot, component$ } from "@builder.io/qwik";

import "./responsiveFieldWrapper.css";

export default component$(() => {
  return (
    <div id="square-wrapper" class="w-full h-full flex flex-col gap-5 items-center justify-center ">
      <div id="square">
        <Slot />
      </div>
    </div>
  );
});
