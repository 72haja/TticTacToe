import { useEffect, useState } from "react";
import { CilCircle, CilXCircle } from "../icons/icons";

interface ItemProps {
  playerIcon: string;
  size?: string;
  wrapperClass?: string;
}

export function Player2Icon({
  size = "",
  ...props
}: ItemProps) {

  const [computedClass, setComputedClass]: [string, (computedClass: string) => void] = useState(
    `${size} aspect-square`
  );

  useEffect(() => {
    setComputedClass(`${size} aspect-square`);
  }, [size]);

  const [computedWrapperClass, setComputedWrapperClass]: [string, (computedWrapperClass: string) => void] = useState(
    `w-full h-full grid grid-cols-1 grid-rows-1 ${props.wrapperClass}`
  );

  useEffect(() => {
    setComputedWrapperClass(`w-full h-full grid grid-cols-1 grid-rows-1 ${props.wrapperClass}`);
  }, [props.wrapperClass]);

  return (
    <div className={computedWrapperClass}>
      {props.playerIcon === "CilCircle"
        ? <CilXCircle className={computedClass} />
        : <CilCircle className={computedClass} />
      }
    </div>
  );
};