import React, { useMemo, useCallback } from 'react';
import * as api from '../../model/api';
import { IndexedYahtzee } from '../../model/game';
import {lower_section_keys,lower_section_slots, sum_upper, total_upper, upper_section_slots, LowerSectionKey } from '../../model/yahtzee.score';
import { die_values, isDieValue, DieValue } from '../../model/dice';
import { scores } from '../../model/yahtzee.game';
import { score } from '../../model/yahtzee.slots';
import './ScoreCard.css';

interface ScoreCardProps {
  game: IndexedYahtzee;
  player: string;
  enabled: boolean;
  className?: string;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ game, player, enabled, className }) => {
  const players = useMemo(() => game.players, [game.players]);
  const upperSections = useMemo(() => game.upper_sections, [game.upper_sections]);
  const lowerSections = useMemo(() => game.lower_sections, [game.lower_sections]);

  // Registers a score for the current key
  const register = useCallback(
    (key: DieValue | LowerSectionKey) => {
      if (enabled) {
        api.register(game, key, player);
      }
    },
    [enabled, game, player]
  );

  // Check if the player is active
  const isActive = useCallback(
    (p: string) => game.players[game.playerInTurn] === player && player === p,
    [game, player]
  );

  // Calculate the scores for each player
  const playerScores = useCallback(
    (key: DieValue | LowerSectionKey) =>
      players.map((p, i) => ({
        player: p,
        score: isDieValue(key) ? upperSections[i].scores[key] : lowerSections[i].scores[key],
      })),
    [players, upperSections, lowerSections]
  );

  // Calculate the potential score for each section
  const potentialScore = useCallback(
    (key: DieValue | LowerSectionKey) =>
      isDieValue(key) ? score(upper_section_slots[key], game.roll) : score(lower_section_slots[key], game.roll),
    [game.roll]
  );

  const displayScore = useCallback((score: number | undefined) => {
    if (score === undefined) return '';
    if (score === 0) return '---';
    return score.toString();
  }, []);

  const activeClass = useCallback(
    (p: string) => (p === player ? 'activeplayer' : undefined),
    [player]
  );

  return (
    <div className={`score ${className}`}> {/* <-- Apply className */}
      <table className="scorecard">
        <tbody>
          <tr className="section_header">
            <td colSpan={players.length + 2}>Upper Section</td>
          </tr>
          <tr>
            <td>Type</td>
            <td>Target</td>
            {players.map((player, i) => (
              <td key={i} className={activeClass(player)}>
                {player}
              </td>
            ))}
          </tr>
          {die_values.map((val) => (
            <tr key={val}>
              <td>{val}s</td>
              <td>{3 * val}</td>
              {playerScores(val).map(({ player, score }, i) => (
                <td
                  key={i}
                  className={isActive(player) && score === undefined ? 'clickable potential' : isActive(player) ? 'activeplayer' : undefined}
                  onClick={() => isActive(player) && score === undefined && register(val)}
                >
                  {displayScore(isActive(player) && score === undefined ? potentialScore(val) : score)}
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <td>Sum</td>
            <td>63</td>
            {players.map((_, index) => (
              <td key={index} className={activeClass(players[index])}>
                {sum_upper(upperSections[index].scores)}
              </td>
            ))}
          </tr>
          <tr>
            <td>Bonus</td>
            <td>50</td>
            {players.map((_, index) => (
              <td key={index} className={activeClass(players[index])}>
                {displayScore(upperSections[index].bonus)}
              </td>
            ))}
          </tr>
          <tr>
            <td>Total</td>
            <td></td>
            {players.map((_, index) => (
              <td key={index} className={activeClass(players[index])}>
                {total_upper(upperSections[index])}
              </td>
            ))}
          </tr>
          <tr className="section_header">
            <td colSpan={players.length + 2}>Lower Section</td>
          </tr>
          {lower_section_keys.map((key) => (
            <tr key={key}>
              <td>{key.charAt(0).toUpperCase() + key.slice(1)}</td>
              <td></td>
              {playerScores(key).map(({ player, score }, i) => (
                <td
                  key={i}
                  className={isActive(player) && score === undefined ? 'clickable potential' : isActive(player) ? 'activeplayer' : undefined}
                  onClick={() => isActive(player) && score === undefined && register(key)}
                >
                  {displayScore(isActive(player) && score === undefined ? potentialScore(key) : score)}
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <td>Total</td>
            <td></td>
            {players.map((_, index) => (
              <td key={index} className={activeClass(players[index])}>
                {scores(game)[index]}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ScoreCard;