import { configureStore } from '@reduxjs/toolkit';
import ongoingGamesReducer from './ongoingGamesSlice';
import pendingGamesReducer from './pendingGamesSlice';
import playerReducer from './playerSlice';
import websocketMiddleware from '../utils/webSocketMiddleware'; // Import middleware

export const store = configureStore({
  reducer: {
    ongoingGames: ongoingGamesReducer,
    pendingGames: pendingGamesReducer,
    player: playerReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(websocketMiddleware), // Add middleware here
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
