import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IndexedYahtzee } from '../model/game';

interface OngoingGamesState {
  gameList: IndexedYahtzee[];
}

const initialState: OngoingGamesState = {
  gameList: [],
};

const ongoingGamesSlice = createSlice({
  name: 'ongoingGames',
  initialState,
  reducers: {
    upsertGame(state, action: PayloadAction<IndexedYahtzee>) {
      const game = action.payload;
      const index = state.gameList.findIndex(g => g.id === game.id);
      if (index > -1) {
        state.gameList[index] = game; // Update if game exists
      } else {
        state.gameList.push(game); // Insert if game does not exist
      }
    },
    updateGame(state, action: PayloadAction<IndexedYahtzee>) {
      const game = action.payload;
      const index = state.gameList.findIndex(g => g.id === game.id);
      if (index > -1) {
        state.gameList[index] = game; // Update the game in the list
      }
    },
  },
});

export const { upsertGame, updateGame } = ongoingGamesSlice.actions;
export default ongoingGamesSlice.reducer;
