import { configureStore } from '@reduxjs/toolkit';
import ongoingGamesReducer from './ongoingGamesSlice';
import pendingGamesReducer from './pendingGamesSlice';
import playerReducer from './playerSlice';

export const store = configureStore({
  reducer: {
    ongoingGames: ongoingGamesReducer,
    pendingGames: pendingGamesReducer,
    player: playerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
