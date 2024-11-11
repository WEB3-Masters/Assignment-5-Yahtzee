import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IndexedYahtzeeSpecs } from '../model/game'

interface PendingGamesState {
  gameList: IndexedYahtzeeSpecs[];
}

const initialState: PendingGamesState = {
  gameList: [],
};

const pendingGamesSlice = createSlice({
  name: 'pendingGames',
  initialState,
  reducers: {
    upsertGame(state, action: PayloadAction<IndexedYahtzeeSpecs>) {
      const game = action.payload;
      const index = state.gameList.findIndex(g => g.id === game.id);
      if (index > -1) {
        state.gameList[index] = game; // Update if game exists
      } else {
        state.gameList.push(game); // Insert if game does not exist
      }
    },
    updateGame(state, action: PayloadAction<IndexedYahtzeeSpecs>) {
      const game = action.payload;
      const index = state.gameList.findIndex(g => g.id === game.id);
      if (index > -1) {
        state.gameList[index] = game; // Update the game in the list
      }
    },
    removeGame(state, action: PayloadAction<number>) {
      const id = action.payload;
      state.gameList = state.gameList.filter(g => g.id !== id); // Remove game by ID
    },
  },
});

export const { upsertGame, updateGame, removeGame } = pendingGamesSlice.actions;
export default pendingGamesSlice.reducer;
