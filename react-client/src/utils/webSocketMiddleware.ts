import { Middleware } from 'redux';
import { gameMessages$ } from './webSocket';
import { upsertGame as upsertOngoingGame } from '../slices/ongoingGamesSlice';
import { upsertGame as upsertPendingGame, removeGame } from '../slices/pendingGamesSlice';

const websocketMiddleware: Middleware = (store) => {
  gameMessages$.subscribe((game) => {
    if (game) {
      if (game.pending) {
        store.dispatch(upsertPendingGame(game)); // Dispatch for pending games
      } else {
        store.dispatch(upsertOngoingGame(game)); // Dispatch for ongoing games
        store.dispatch(removeGame(game.id)); // Remove from pending if it's ongoing
      }
    }
  });

  return (next) => (action) => next(action);
};

export default websocketMiddleware;
