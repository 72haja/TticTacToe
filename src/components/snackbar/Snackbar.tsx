import { component$, useComputed$, useContext, useSignal, useTask$ } from "@builder.io/qwik";
import { FaCircleCheckRegular } from "@qwikest/icons/font-awesome";
import { SnackbarCTX, SnackbarState } from "../../store/SnackbarStore";

export default component$(() => {

  const snackbarCTX = useContext(SnackbarCTX) as SnackbarState;

  const timeout = useSignal(0);

  useTask$(({ track }) => {
    const show = track(() => snackbarCTX.show);
    const id = track(() => snackbarCTX.id);

    if (show || id) {
      if (timeout.value > 0) {
        clearTimeout(timeout.value);
      }

      timeout.value = setTimeout(() => {
        snackbarCTX.show = false;
      }, snackbarCTX.timeout) as unknown as number;
    }
  });

  const snackbarWrapperColor = useComputed$(() => {
    switch (snackbarCTX.type) {
      case "success":
        return "bg-teal-100 border-teal-500 text-teal-900";
      case "error":
        return "bg-red-100 border-red-500 text-red-900";
      default:
        return "bg-teal-100 border-teal-500 text-teal-900";
    }
  });

  const snackbarTextColor = useComputed$(() => {
    switch (snackbarCTX.type) {
      case "success":
        return "text-teal-500";
      case "error":
        return "text-red-500";
      default:
        return "text-teal-500";
    }
  });

  return (
    <div
      class="absolute bottom-0 left-0 w-full p-4 flex justify-center"
    >
      {
        snackbarCTX.show
          ? <div
            class={[
              "border-t-4 rounded-b px-4 py-3 shadow-md w-[400px] max-w-[400px]",
              snackbarWrapperColor.value
            ]}
            role="alert"
          >
            <div class="flex items-center">
              <div class="py-1 tw-h-full flex flex-col justify-center">
                <FaCircleCheckRegular class={[
                  "fill-current h-6 w-6 mr-4",
                  snackbarTextColor.value,
                ]} />
              </div>
              <p class="font-bold">{snackbarCTX.text}</p>
            </div>
          </div>
          : <div></div>
      }
    </div>
  );
})