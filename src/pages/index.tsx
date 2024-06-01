import { Snackbar } from "@/components/snackbar/Snackbar";
import { SnackbarState } from "@/reducers/snackbarReducer";
import { useRouter } from "next/router";
import { useState } from "react";
import { v4 as uuid } from "uuid";

import { EnterGame } from "@/components/enterGame/EnterGame";
import '../app/globals.css';
import { Footer } from "@/components/footer/Footer";

export default function Home() {
  const router = useRouter()

  function newGame() {
    router.push(`/game/${uuid()}`);
  }

  function enterGame(gameId: string) {
    const filteredGameId = gameId.replace(/(.*\/game\/)/, "");
    router.push(`/game/${filteredGameId}`);
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
      <div className="bg-gray-500 flex items-center justify-center w-full h-full md:p-12 p-4">
        <EnterGame
          newGame={newGame}
          enterGame={enterGame}
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
