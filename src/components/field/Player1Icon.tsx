import { component$, useComputed$ } from "@builder.io/qwik";
import { CilCircle, CilXCircle } from "../icons/icons";

interface ItemProps {
  playerIcon: string;
  size?: string;
}

export default component$<ItemProps>(({
  size = "w-11/12",
  ...props
}) => {

  const computedClass = useComputed$(() => {
    return `${size} aspect-square`;
  });

  return (
    <div class="flex items-center justify-center h-full w-full">
      {props.playerIcon === "CilCircle"
        ? <CilCircle class={computedClass} />
        : <CilXCircle class={computedClass} />
      }
    </div>
  );
});