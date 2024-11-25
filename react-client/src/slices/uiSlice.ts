import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  error?: string;
}

const initialState: UIState = {
  error: undefined,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setError(state, action: PayloadAction<string | undefined>) {
      state.error = action.payload;
    },
    clearError(state) {
      state.error = undefined;
    },
  },
});

export const { setError, clearError } = uiSlice.actions;
export default uiSlice.reducer; 