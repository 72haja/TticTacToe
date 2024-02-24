import { component$, useComputed$ } from "@builder.io/qwik";
import { CilCircle, CilXCircle } from "../icons/icons";

interface ItemProps {
  playerIcon: string;
  size?: string;
  wrapperClass?: string;
}

export default component$<ItemProps>(({
  size = "w-11/12",
  ...props
}) => {

  const computedClass = useComputed$(() => {
    return `${size} aspect-square`;
  });
  
  const computedWrapperClass = useComputed$(() => {
    return `w-full h-full flex items-center justify-center ${props.wrapperClass}`;
  })

  return (
    <div class={computedWrapperClass}>
      {props.playerIcon === "CilCircle"
        ? <CilXCircle class={computedClass} />
        : <CilCircle class={computedClass} />
      }
    </div>
  );
});