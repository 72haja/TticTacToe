import { useRouter } from "next/router";

export function ButtonRow() {

  const router = useRouter()

  function routeToHome() {
    router.push(`/`);
  }

  return (
    <div className="absolute top-0 left-0 p-4">
      <button 
        className="bg-gray-600 active:bg-gray-700 rounded-lg px-2"
        onClick={routeToHome}
      >
        Home
      </button>
    </div>
  );
}