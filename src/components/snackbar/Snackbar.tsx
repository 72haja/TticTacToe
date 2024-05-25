import { SnackbarState, initialState, snackbarReducer } from '@/reducers/snackbarReducer';
import { useEffect, useState } from 'react';


export function Snackbar(props: SnackbarState & { setSnackbarState: (state: SnackbarState) => void }) {

  const [timeout, setLocalTimeout]: [
    ReturnType<typeof setTimeout>, 
    (timeout: ReturnType<typeof setTimeout>) => void
  ] = useState(null as unknown as ReturnType<typeof setTimeout>);

  
  useEffect(() => {
    if (props.show || props.id) {
      if (timeout !== null) {
        clearTimeout(timeout);
      }
  
      const newTimeout: ReturnType<typeof setTimeout> = setTimeout(() => {
        props.setSnackbarState({
          show: false,
          text: "",
          color: "success",
          timeout: 3000,
          id: "",
        });
      }, props.timeout);
      setLocalTimeout(newTimeout);
    }
  }, [props])

  const [snackbarWrapperColor, setSnackbarWrapperColor]: [
    string, 
    (color: string) => void
  ] = useState("bg-white border-teal-500 text-teal-900");

  const [snackbarTextColor, setSnackbarTextColor]: [
    string,
    (color: string) => void
  ] = useState("text-teal-500");


  useEffect(() => {
    switch (props.color) {
      case "success":
        setSnackbarWrapperColor("bg-white border-teal-500 text-teal-900");
        setSnackbarTextColor("text-teal-500");
        break;
      case "error":
        setSnackbarWrapperColor("bg-red-100 border-red-500 text-red-900");
        setSnackbarTextColor("text-red-500");
        break;
      default:
        setSnackbarWrapperColor("bg-white border-teal-500 text-teal-900");
        setSnackbarTextColor("text-teal-500");
        break;
    }
  }, [props.color]);

  return (
    <div className="absolute z-10 bottom-10 left-0 w-full p-4 flex justify-center">
      {
        props.show
          ? <div
            className={
              "border-t-4 rounded-b px-4 py-3 shadow-md w-[400px] max-w-[400px] "
              + snackbarWrapperColor
            }
            role="alert"
          >
            <div className="flex items-center">
              <p className="font-bold">{props.text}</p>
            </div>
          </div>
          : <div></div>
      }
    </div>
  );
}
