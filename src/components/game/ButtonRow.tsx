import { socket } from "@/pages/game/[id]";
import { useRouter } from "next/router";
import { TMenu } from "../ds/TMenu";
import { BanIcon, SettingsIcon, ShuffleIcon } from "../icons/icons";

export function ButtonRow() {

  const router = useRouter()

  function routeToHome() {
    router.push(`/`);
  }

  const menuItems = [
    {label: "Remove other player", icon: <BanIcon className="w-3 h-3 aspect-square text-white"/>},
    {label: "Switch Player", icon: <ShuffleIcon className="w-3 h-3 aspect-square text-white"/> },
  ]

  function onItemClick(item: string) {
    switch (item) {
      case "Remove other player":
        socket.emit("remove-other-player", router.query.id as string);
        break;
      case "Switch Player":
        socket.emit("switch-player", router.query.id as string);
        break;
      default:
        break;
    }
  }

  return (
    <div className="absolute top-0 left-0 p-4 flex gap-2">
      <button 
        className="bg-gray-600 active:bg-gray-700 rounded-lg px-2"
        onClick={routeToHome}
      >
        Home
      </button>
      <TMenu
        menuIcon={
          <SettingsIcon className="w-5 h-5 aspect-square text-white"/>
        }
        items={menuItems}
        onItemClick={onItemClick}
      />
    </div>
  );
}