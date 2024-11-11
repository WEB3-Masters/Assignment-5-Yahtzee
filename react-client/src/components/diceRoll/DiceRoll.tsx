// DiceRoll.tsx
import React, { useState, useEffect, useMemo } from 'react';
import * as api from '../../model/api';
import { IndexedYahtzee } from '../../model/game';
import './DiceRoll.css';

interface DiceRollProps {
  game: IndexedYahtzee;
  player: string;
  enabled: boolean;
}

const DiceRoll: React.FC<DiceRollProps> = ({ game, player, enabled }) => {
  // State to track which dice are held
  const [held, setHeld] = useState([false, false, false, false, false]);

  // Determine if reroll is enabled
  const rerollEnabled = useMemo(() => game && game.rolls_left > 0 && enabled, [game, enabled]);

  // Watch `rerollEnabled` and reset held dice if reroll is disabled
  useEffect(() => {
    if (!rerollEnabled) {
      setHeld([false, false, false, false, false]);
    }
  }, [rerollEnabled]);

  // Reroll function
  const reroll = async () => {
    const heldIndices = held.map((isHeld, index) => (isHeld ? index : undefined)).filter(i => i !== undefined);
    await api.reroll(game, heldIndices, player);
  };

  // Toggle held dice
  const toggleHeld = (index: number) => {
    setHeld(prev => prev.map((value, i) => (i === index ? !value : value)));
  };

  return (
    <div className="dice">
      {!enabled && <div className="diceheader">{game.players[game.playerInTurn]} is playing</div>}
      <div className="die"></div>
      {game.roll.map((d, i) => (
        <div key={i} className={`die die${d}`}>{d}</div>
      ))}
      <div className="caption">{enabled && rerollEnabled ? 'Hold:' : ''}</div>
      {enabled && rerollEnabled &&
        game.roll.map((_, i) => (
          <input
            key={i}
            type="checkbox"
            checked={held[i]}
            onChange={() => toggleHeld(i)}
          />
        ))}
      {enabled && rerollEnabled && (
        <div className="reroll">
          <button onClick={reroll}>Re-roll</button>
        </div>
      )}
    </div>
  );
};

export default DiceRoll;
