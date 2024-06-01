import { useState } from "react";

interface ItemProps {
  menuIcon: string | JSX.Element;
  items: string[] | { label: string, icon?: JSX.Element }[];
  onItemClick: (item: string) => void;
}

export function TMenu(props: ItemProps) {
  const [menuIsOpen, setMenuIsOpen]: [boolean, (menuIsOpen: boolean) => void] = useState(false);

  function handleItemClick(item: string) {
    props.onItemClick(item);
    setMenuIsOpen(false);
  }

  return (
    <div className="relative">
      <button 
        className="bg-gray-600 active:bg-gray-700 rounded-lg px-2 h-full"
        onClick={() => setMenuIsOpen(!menuIsOpen)}
      >
        {props.menuIcon ?? "Menu"}
      </button>
      
      <div>
        {menuIsOpen && (
          <div>
            <div
              className="absolute top-12 left-0 p-1 bg-gray-600 rounded-lg
                  flex flex-col gap-2 items-center justify-center z-20"
            >
              {props.items.map((item, index) => {
                if (typeof item === "string") {
                  return (
                    <button
                      key={index}
                      className="w-full min-w-max bg-gray-600 active:bg-gray-700 hover:bg-gray-500 rounded-lg px-2 py-1"
                      onClick={() => handleItemClick(item)}
                    >
                      {item}
                    </button>
                  );
                } else {
                  return (
                    <button
                      key={index} 
                      className="w-full min-w-max bg-gray-600 active:bg-gray-700 hover:bg-gray-500 rounded-lg px-2 py-1
                        flex items-center justify-start gap-2"
                      onClick={() => handleItemClick(item.label)}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  );
                }
              })}
            </div>
            <div
              className="fixed top-0 left-0 w-screen h-screen bg-gray-900/10 z-10"
              onClick={() => setMenuIsOpen(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
