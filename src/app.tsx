import { component$ } from "@builder.io/qwik";

import "./app.css";
import Field from "./components/field/Field.tsx";

export const App = component$(() => {
  return (
    <>
      <div class="bg-gray-500 flex items-center justify-center w-full h-full p-12">
        <Field />
      </div>
    </>
  );
});
