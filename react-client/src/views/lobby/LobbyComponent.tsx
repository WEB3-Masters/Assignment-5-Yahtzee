import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../../model/api';
import { useSelector } from 'react-redux';
import { RootState } from '../../slices/store';

const LobbyComponent: React.FC = () => {
  const navigate = useNavigate();
  const player = useSelector((state: RootState) => state.player.player); // Assuming Redux for playerStore
  const [numberOfPlayers, setNumberOfPlayers] = useState(2);

  // Redirect to login if the player is not set
  useEffect(() => {
    if (!player) {
      navigate('/login');
    }
  }, [player, navigate]);

  // Function to start a new game
  const newGame = async (player: string) => {
    const pendingGame = await api.new_game(numberOfPlayers, player);
    setTimeout(() => navigate(`/pending/${pendingGame.id}`), 100);
  };

  return (
    <div>
      <h1>Yahtzee!</h1>
      {player ? (
        <main>
          <label>
            Number of players:
            <input
              type="number"
              min="1"
              value={numberOfPlayers}
              onChange={(e) => setNumberOfPlayers(Number(e.target.value))}
            />
          </label>
          <button onClick={() => newGame(player)}>New Game</button>
        </main>
      ) : null}
    </div>
  );
};

export default LobbyComponent;
