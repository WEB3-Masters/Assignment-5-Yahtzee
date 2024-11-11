// GameComponent.tsx
import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import DiceRoll from '../../components/diceRoll/DiceRoll';
import ScoreCard from '../../components/scoreCard/ScoreCard';
import { RootState } from '../../slices/store';
import { IndexedYahtzee } from '../../model/game';
import { is_finished, scores } from 'models/src/model/yahtzee.game';
import { setPlayer } from '../../slices/playerSlice';
import './GameComponent.css';


const GameComponent: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: routeId } = useParams<{ id: string }>();

  // Convert the route parameter to a number for compatibility with game ID
  const id = parseInt(routeId || '', 10);

  // Selectors to get the game and player from the Redux store
  const game = useSelector((state: RootState) =>
    state.ongoingGames.gameList.find((g: IndexedYahtzee) => g.id === id)
  );
  const player = useSelector((state: RootState) => state.player.player);

  // Check if the player is enabled for the current game
  const enabled = useMemo(
    () => game !== undefined && player === game.players[game.playerInTurn],
    [game, player]
  );

  // Check if the game is finished
  const finished = useMemo(() => game === undefined || is_finished(game), [game]);

  // Calculate standings
  const standings = useMemo(() => {
    if (!game) return [];
    const g = game;
    const standingsArray: [string, number][] = scores(g).map((score, i) => [g.players[i], score]);
    standingsArray.sort(([, score1], [, score2]) => score2 - score1);
    return standingsArray;
  }, [game]);

  // Redirect to login if player is not defined, or to home if game is not found
  useEffect(() => {
    if (!player) {
      navigate(`/login?game=${id}`, { replace: true });
    } else if (!game) {
      navigate('/', { replace: true });
    }
  }, [player, game, navigate, id]);

  return (
    <div>
      {game && player ? (
        <div className="game">
          <div className="meta">
            <h1>Game #{id}</h1>
          </div>
          <ScoreCard className="card" game={game} player={player} enabled={enabled} />
          {!finished && <DiceRoll className="roll" game={game} player={player} enabled={enabled} />}
          {finished && (
            <div className="scoreboard">
              <table>
                <thead>
                  <tr>
                    <td>Player</td>
                    <td>Score</td>
                  </tr>
                </thead>
                <tbody>
                  {standings.map(([playerName, score]) => (
                    <tr
                      key={playerName}
                      className={playerName === player ? 'current' : undefined}
                    >
                      <td>{playerName}</td>
                      <td>{score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default GameComponent;
