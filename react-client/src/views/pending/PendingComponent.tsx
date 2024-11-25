import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { RootState } from '../../slices/store';
import { joinGame, fetchGames } from '../../slices/gameThunks';
import { AppDispatch } from '../../slices/store';

const PendingComponent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const gameId = id ? parseInt(id) : 0;

  // Accessing the Redux state
  const player = useSelector((state: RootState) => state.player.player);
  const game = useSelector((state: RootState) =>
    state.pendingGames.gameList.find(value => value.id === gameId)
  );
  const ongoingGame = useSelector((state: RootState) =>
    state.ongoingGames.gameList.find(value => value.id === gameId)
  );

  // Add this effect to fetch games when component mounts
  useEffect(() => {
    if (!game) {
      dispatch(fetchGames());
    }
  }, [dispatch, game]);

  // Redirects based on state changes
  useEffect(() => {
    if (!player) {
      navigate(`/login?pending=${id}`);
    }
  }, [id, player, navigate]);

  useEffect(() => {
    if(ongoingGame) {
      navigate(`/game/${ongoingGame.id}`);
    }
  }, [ongoingGame, navigate]);

  const canJoin = game && player && !game.players.includes(player);

  const join = useCallback(async () => {
    if (game && player && canJoin) {
      try {
        const result = await dispatch(joinGame({ game, player })).unwrap();
        if (!result.pending) {
          navigate(`/game/${result.id}`);
        }
      } catch (err) {
        console.error('Failed to join game:', err);
      }
    }
  }, [game, player, canJoin, dispatch, navigate]);

  // Add loading state
  if (!game) return <div>Loading game...</div>;

  const availableSeats = (game?.number_of_players ?? 2) - game.players.length;

  return (
    <div>
      <h1>Game #{game.id}</h1>
      <div>Created by: {game.creator}</div>
      <div>Players: {game.players.join(', ')}</div>
      <div>Available Seats: {availableSeats}</div>
      {canJoin && <button onClick={join}>Join</button>}
    </div>
  );
};

export default PendingComponent;