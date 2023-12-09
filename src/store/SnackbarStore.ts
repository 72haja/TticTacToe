import { createContextId } from '@builder.io/qwik';

type SnackbarType = 'success' | 'error';

export interface SnackbarState {
  show: boolean;
  text: string;
  type: SnackbarType;
  timeout: number;
  id: string;
}

export const SnackbarCTX = createContextId<SnackbarState>('snackbar');
