import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PlayerState {
  player?: string;
}

const initialState: PlayerState = {
  player: undefined,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setPlayer(state, action: PayloadAction<string | undefined>) {
      state.player = action.payload;
    },
  },
});

export const { setPlayer } = playerSlice.actions;
export default playerSlice.reducer;
