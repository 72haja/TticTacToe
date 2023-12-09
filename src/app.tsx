import { component$, useContextProvider, useStore } from "@builder.io/qwik";

import "./app.css";
import Field from "./components/field/Field.tsx";
import Snackbar from "./components/snackbar/Snackbar.tsx";
import { SnackbarCTX, SnackbarState } from "./store/SnackbarStore.ts";
import { v4 as uuid } from "uuid";

export const App = component$(() => {

  const snackbarStore = useStore<SnackbarState>({
    show: true,
    text: "lorem ipsum dolor sit amet consectur adispicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    timeout: 3000,
    type: "success",
    id: uuid(),
  });

  useContextProvider(SnackbarCTX, snackbarStore);

  return (
    <>
      <div class="bg-gray-500 flex items-center justify-center w-full h-full p-12">
        <Field />
        <button onClick$={() => {
          snackbarStore.show = true;
          snackbarStore.text = "You are player 1";
          snackbarStore.type = "success";
          snackbarStore.id = uuid();
        }}>
          showSnackbar
        </button>
        <Snackbar />
      </div>
    </>
  );
});
