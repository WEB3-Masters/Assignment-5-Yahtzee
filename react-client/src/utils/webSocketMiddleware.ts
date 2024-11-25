import { Middleware } from 'redux';
import { pendingGames$, ongoingGames$, errors$ } from './webSocket';
import { upsertGame as upsertOngoingGame } from '../slices/ongoingGamesSlice';
import { upsertGame as upsertPendingGame, removeGame } from '../slices/pendingGamesSlice';
import { setError } from '../slices/uiSlice';

const websocketMiddleware: Middleware = (store) => {
  // Handle pending games
  pendingGames$.subscribe((game) => {
    store.dispatch(upsertPendingGame(game));
  });

  // Handle ongoing games
  ongoingGames$.subscribe((game) => {
    store.dispatch(upsertOngoingGame(game));
    store.dispatch(removeGame(game.id));
  });

  // Handle errors
  errors$.subscribe((error) => {
    store.dispatch(setError(error instanceof Error ? error.message : 'Unknown error occurred'));
  });

  return (next) => (action) => next(action);
};

export default websocketMiddleware;
