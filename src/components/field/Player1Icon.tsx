import { component$, useComputed$ } from "@builder.io/qwik";
import { CilCircle, CilXCircle } from "../icons/icons";

interface ItemProps {
  playerIcon: string;
  size?: string;
  wrapperClass?: string;
}

export default component$<ItemProps>(({
  size = "",
  ...props
}) => {

  const computedClass = useComputed$(() => {
    return `${size} aspect-square`;
  });

  const computedWrapperClass = useComputed$(() => {
    return `w-full h-full grid grid-cols-1 grid-rows-1 ${props.wrapperClass}`;
  })

  return (
    <div class={computedWrapperClass}>
      {props.playerIcon === "CilCircle"
        ? <CilCircle class={computedClass} />
        : <CilXCircle class={computedClass} />
      }
    </div>
  );
});