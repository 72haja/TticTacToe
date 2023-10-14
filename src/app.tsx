import { component$ } from "@builder.io/qwik";

import Field from "./components/field/field.tsx";
import "./app.css";

export const App = component$(() => {
  return (
    <>
      <div class="flex items-center justify-center w-full h-full">
        <Field></Field>
      </div>
    </>
  );
});
