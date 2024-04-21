import { v4 as uuid } from 'uuid';

export type SnackbarActionType = 'show' | 'show_error' | 'show_success'

export type SnackbarType = 'success' | 'error';

// An interface for our state
export type SnackbarState = {
  show: boolean;
  text: string;
  color: SnackbarType;
  timeout: number;
  id: string;
}

// An interface for our actions
type SnackbarAction = SnackbarState & {
  type: SnackbarActionType;
}

export const initialState: SnackbarState = {
  show: false,
  text: '',
  color: 'success',
  timeout: 3000,
  id: uuid(),
}

// Our reducer function that uses a switch statement to handle our actions
export function snackbarReducer(
  state: SnackbarState, 
  action: SnackbarAction
) : SnackbarState {
  const { 
    type,
    color,
    text,
    timeout,
    id,
  } = action;
  switch (type) {
    case "show":
      console.log('text', text);
      return {
        ...state,
        show: true,
        text,
        color,
        timeout,
        id,
      };
    case "show_error":
      return {
        ...state,
        show: true,
        text,
        color: 'error',
        timeout,
        id,
      };
    case "show_success":
      return {
        ...state,
        show: true,
        text,
        color: 'success',
        timeout,
        id,
      };
    default:
      return state;
  }
}
