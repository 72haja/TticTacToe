import { Field } from "@/components/field/Field";
import { Snackbar } from "@/components/snackbar/Snackbar";
import { SnackbarState } from "@/reducers/snackbarReducer";
import { useRouter } from "next/router";
import { useState } from "react";
import { v4 as uuid } from "uuid";

import '../../app/globals.css';

export default function Home() {
  const router = useRouter()

  function routeToHome() {
    router.push(`/`);
  }

  const [snackbarState, setSnackbarState] = useState<SnackbarState>({
    show: false,
    text: "",
    color: "success",
    timeout: 3000,
    id: uuid(),
  });

  return (
    <main className="w-full h-full">
      <div className="bg-gray-500 flex items-center justify-center w-full h-full p-12">
        <div className="absolute top-0 left-0 p-4">
          <button 
            className="bg-gray-600 active:bg-gray-700 rounded-lg px-2"
            onClick={routeToHome}
          >
            Home
          </button>
        </div>
        <Field
          setSnackbar={setSnackbarState}
          room={router.query.id as string}
        />
        <Snackbar
          show={snackbarState.show}
          text={snackbarState.text}
          color={snackbarState.color}
          timeout={snackbarState.timeout}
          id={snackbarState.id}
          setSnackbarState={setSnackbarState}
        />
      </div>
    </main>
  );
}
