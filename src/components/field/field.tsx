import { component$ } from "@builder.io/qwik";

export default component$(() => {
  return (
    <div class="grid grid-cols-3 grid-rows-3 w-full h-full max-w-[100%] max-h-[100%] [&>div]:border [&>div]:border-black [&>div]:flex [&>div]:items-center [&>div]:justify-center">
      <div>1</div>
      <div>2</div>
      <div>3</div>
      <div>1</div>
      <div>2</div>
      <div>3</div>
      <div>1</div>
      <div>2</div>
      <div>3</div>
    </div>
  );
});
