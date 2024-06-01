import { Field } from "@/components/field/Field";
import { Snackbar } from "@/components/snackbar/Snackbar";
import { SnackbarState } from "@/reducers/snackbarReducer";
import { useState } from "react";
import { io } from "socket.io-client";
import { v4 as uuid } from "uuid";

import { Footer } from "@/components/footer/Footer";
import { ButtonRow } from "@/components/game/ButtonRow";
import { useRouter } from "next/router";
import '../../app/globals.css';


const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL as string;
export const socket = io(serverUrl);

export default function Home() {

  const router = useRouter()

  const [snackbarState, setSnackbarState] = useState<SnackbarState>({
    show: false,
    text: "",
    color: "success",
    timeout: 3000,
    id: uuid(),
  });

  return (
    <main className="w-full h-full">
      <div className="bg-gray-500 flex items-center justify-center w-full h-full md:p-12 p-4">
        <ButtonRow />
        <Field
          setSnackbar={setSnackbarState}
          room={router.query.id as string}
        />
      </div>
      <Snackbar
        show={snackbarState.show}
        text={snackbarState.text}
        color={snackbarState.color}
        timeout={snackbarState.timeout}
        id={snackbarState.id}
        setSnackbarState={setSnackbarState}
      />
      <Footer />
    </main>
  );
}
