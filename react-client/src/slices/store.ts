import { configureStore } from '@reduxjs/toolkit';
import ongoingGamesReducer from './ongoingGamesSlice';
import pendingGamesReducer from './pendingGamesSlice';
import playerReducer from './playerSlice';
import uiReducer from './uiSlice';
import websocketMiddleware from '../utils/webSocketMiddleware';

export const store = configureStore({
  reducer: {
    ongoingGames: ongoingGamesReducer,
    pendingGames: pendingGamesReducer,
    player: playerReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware()
      .concat(websocketMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
