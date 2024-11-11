import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import * as api from '../../model/api';
import { RootState } from '../../slices/store';
import { removeGame } from '../../slices/pendingGamesSlice';
import { upsertGame as upsertOngoingGame } from '../../slices/ongoingGamesSlice';
import { IndexedYahtzee } from '../../model/game';

const PendingComponent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Accessing the Redux state
  const player = useSelector((state: RootState) => state.player.player);
  const pendingGames = useSelector((state: RootState) => state.pendingGames.gameList);
  const ongoingGames = useSelector((state: RootState) => state.ongoingGames.gameList);

  // Parse the game id and check if it exists in the pending games list
  const gameId = id ? parseInt(id) : 0; // Fallback to 0 if id is undefined
  const game = pendingGames.find((g) => g.id === gameId);
  const canJoin = game && player && !game.players.includes(player);

  // Redirects based on state changes
  useEffect(() => {
    if (!player) {
      // If the player is not logged in, redirect to the login page
      navigate(`/login?pending=${id}`);
    } else if (!game) {
      // If the game is not found in pending or ongoing, navigate accordingly
      if (ongoingGames.some((g) => g.id === gameId)) {
        navigate(`/game/${gameId}`);
      } else {
        navigate('/');
      }
    }
  }, [id, player, game, navigate, ongoingGames]);

  const join = useCallback(() => {
    if (game && player && canJoin) {
      api.join(game, player)
        .then(() => {
          // Create the gameData without the 'pending' property and add the missing required fields
          const gameData: IndexedYahtzee = {
            ...game,
            pending: false, // Change pending to false
            playerInTurn: 0, // Set initial values for missing properties
            roll: [],
            rolls_left: 0,
            upper_sections: [], // Provide the missing upper_sections
            lower_sections: [] // Provide the missing lower_sections
          };
  
          dispatch(upsertOngoingGame(gameData)); // Add the game to ongoing games
          dispatch(removeGame(game.id)); // Remove the game from pending games
        })
        .catch((err) => {
          console.error('Failed to join game:', err);
        });
    }
  }, [game, player, canJoin, dispatch]);

  if (!game) return <div>Loading...</div>; // Handle loading state

  const availableSeats = (game?.number_of_players ?? 2) - game.players.length; // Handle number_of_players being undefined

  return (
    <div>
      <h1>Game #{gameId}</h1>
      <div>Created by: {game.creator}</div>
      <div>Players: {game.players.join(', ')}</div>
      <div>Available Seats: {availableSeats}</div>
      {canJoin && <button onClick={join}>Join</button>}
    </div>
  );
};

export default PendingComponent;