import { component$, useContextProvider, useStore } from "@builder.io/qwik";

import "./app.css";
import Field from "./components/field/Field.tsx";
import Snackbar from "./components/snackbar/Snackbar.tsx";
import { SnackbarCTX, SnackbarState } from "./store/SnackbarStore.ts";
import { v4 as uuid } from "uuid";

export const App = component$(() => {

  const snackbarStore = useStore<SnackbarState>({
    show: false,
    text: "",
    timeout: 3000,
    type: "success",
    id: uuid(),
  });

  useContextProvider(SnackbarCTX, snackbarStore);

  return (
    <>
      <div class="bg-gray-500 flex items-center justify-center w-full h-full p-12">
        <Field />
        <Snackbar />
      </div>
    </>
  );
});
