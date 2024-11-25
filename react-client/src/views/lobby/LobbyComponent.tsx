import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../slices/store';
import { fetchGames, createGame, joinGame } from '../../slices/gameThunks';
import { AppDispatch } from '../../slices/store';
import './LobbyComponent.css';

const LobbyComponent: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const player = useSelector((state: RootState) => state.player.player);
  const pendingGames = useSelector((state: RootState) => state.pendingGames.gameList);
  const ongoingGames = useSelector((state: RootState) => state.ongoingGames.gameList);
  const [numberOfPlayers, setNumberOfPlayers] = useState(2);
  const [isLoading, setIsLoading] = useState(true);

  // Memoize the filtered games to prevent unnecessary recalculations
  const playerGames = useMemo(() => {
    if (!player) return { pending: null, ongoing: null };
    return {
      pending: pendingGames.find(game => 
        game.players.includes(player) || game.creator === player
      ),
      ongoing: ongoingGames.find(game => 
        game.players.includes(player)
      )
    };
  }, [player, pendingGames, ongoingGames]);

  // Fetch games only once when component mounts or player changes
  useEffect(() => {
    const initializeLobby = async () => {
      if (!player) {
        navigate('/login');
        return;
      }

      try {
        setIsLoading(true);
        await dispatch(fetchGames()).unwrap();
      } catch (error) {
        console.error('Error fetching games:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeLobby();
  }, [player, dispatch, navigate]);

  // Handle redirects based on player's games
  useEffect(() => {
    if (playerGames.ongoing) {
      navigate(`/game/${playerGames.ongoing.id}`);
    } else if (playerGames.pending) {
      navigate(`/pending/${playerGames.pending.id}`);
    }
  }, [playerGames, navigate]);

  // Memoize handlers to prevent unnecessary recreations
  const handleCreateGame = useCallback(async () => {
    if (!player) return;
    try {
      const result = await dispatch(createGame({ numberOfPlayers, player })).unwrap();
      if (result.pending) {
        navigate(`/pending/${result.id}`);
      }
    } catch (error) {
      console.error('Error creating new game:', error);
    }
  }, [dispatch, navigate, numberOfPlayers, player]);

  const handleJoinGame = useCallback(async (game: any) => {
    if (!player) return;
    try {
      await dispatch(joinGame({ game, player }));
    } catch (error) {
      console.error('Error joining game:', error);
    }
  }, [dispatch, player]);

  if (isLoading) {
    return <div className="lobby-container">Loading...</div>;
  }

  if (!player) {
    return null;
  }

  return (
    <div className="lobby-container">
      <h1>Yahtzee!</h1>
      <main>
        <section className="create-game">
          <h2>Create New Game</h2>
          <label>
            Number of players:
            <input
              type="number"
              min="2"
              max="4"
              value={numberOfPlayers}
              onChange={(e) => setNumberOfPlayers(Number(e.target.value))}
            />
          </label>
          <button onClick={handleCreateGame}>New Game</button>
        </section>

        <section className="pending-games">
          <h2>Available Games</h2>
          {pendingGames.length === 0 ? (
            <p>No games available to join</p>
          ) : (
            <ul>
              {pendingGames.map(game => (
                <li key={game.id}>
                  <span>Created by: {game.creator}</span>
                  <span>Players: {game.players.length}/{game.number_of_players}</span>
                  <button 
                    onClick={() => handleJoinGame(game)}
                    disabled={game.players.includes(player) || game.creator === player}
                  >
                    Join Game
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="ongoing-games">
          <h2>Ongoing Games</h2>
          {ongoingGames.length === 0 ? (
            <p>No ongoing games</p>
          ) : (
            <ul>
              {ongoingGames.map(game => (
                <li key={game.id}>
                  <span>Players: {game.players.join(', ')}</span>
                  <button onClick={() => navigate(`/game/${game.id}`)}>
                    {game.players.includes(player) ? 'Return to Game' : 'Spectate'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
};

export default LobbyComponent;
