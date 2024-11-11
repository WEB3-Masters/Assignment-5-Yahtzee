import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { gameMessages$ } from './utils/webSocket'; // Import the WebSocket observable
import { upsertGame as upsertOngoingGame } from './slices/ongoingGamesSlice';
import { upsertGame as upsertPendingGame, removeGame } from './slices/pendingGamesSlice';
import AppRouter from './router/AppRouter'; // Import the AppRouter component

const App: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const subscription = gameMessages$.subscribe((game) => {
      console.log("Received game message:", game); // Log to check if you're receiving data
      if (game) {
        if (game.pending) {
          // Dispatch the upsert action for pending games
          dispatch(upsertPendingGame(game));
        } else {
          // Dispatch the upsert action for ongoing games
          dispatch(upsertOngoingGame(game));
          dispatch(removeGame(game.id)); // Remove from pending if game is ongoing
        }
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  return (
    <div>
      <AppRouter /> {/* Add the router to render different components based on the route */}
    </div>
  );
};

export default App;
