import { Snackbar } from "@/components/snackbar/Snackbar";
import { SnackbarState } from "@/reducers/snackbarReducer";
import { useRouter } from "next/router";
import { useState } from "react";
import { v4 as uuid } from "uuid";

import '../app/globals.css';
import { EnterGame } from "@/components/enterGame/EnterGame";

export default function Home() {
  const router = useRouter()

  function newGame() {
    router.push(`/game/${uuid()}`);
  }

  function enterGame(gameId: string) {
    router.push(`/game/${gameId}`);
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
        <EnterGame
          newGame={newGame}
          enterGame={enterGame}
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
