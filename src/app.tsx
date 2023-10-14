import { component$ } from "@builder.io/qwik";

import ResponsiveFieldWrapper from "./components/responsiveFieldWrapper/responsiveFieldWrapper.tsx";
import "./app.css";

export const App = component$(() => {
  return (
    <>
      <div class="flex items-center justify-center w-full h-full">
        <ResponsiveFieldWrapper />
      </div>
    </>
  );
});
