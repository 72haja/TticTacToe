import { Slot, component$ } from "@builder.io/qwik";

import "./responsiveFieldWrapper.css";

export default component$(() => {
  return (
    <div class="w-full h-full flex flex-col gap-5 items-center justify-center ">
      <div id="square">
        <Slot />
      </div>
    </div>
  );
});
