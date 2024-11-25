import { createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../model/api';
import { updateAllGames as updateAllPendingGames, upsertGame as upsertPendingGame } from './pendingGamesSlice';
import { updateAllGames as updateAllOngoingGames, upsertGame as upsertOngoingGame } from './ongoingGamesSlice';
import { IndexedYahtzee, IndexedYahtzeeSpecs } from '../model/game';

// Fetch both pending and ongoing games
export const fetchGames = createAsyncThunk(
  'games/fetchAll',
  async (_, { dispatch }) => {
    try {
      const [pendingGames, ongoingGames] = await Promise.all([
        api.pending_games(),
        api.games()
      ]);

      dispatch(updateAllPendingGames(pendingGames));
      dispatch(updateAllOngoingGames(ongoingGames));

      return { pendingGames, ongoingGames };
    } catch (error) {
      throw error;
    }
  }
);

// Create a new game
export const createGame = createAsyncThunk(
  'games/create',
  async ({ numberOfPlayers, player }: { numberOfPlayers: number, player: string }, { dispatch }) => {
    try {
      const game = await api.new_game(numberOfPlayers, player);
      if (game.pending) {
        dispatch(upsertPendingGame(game));
      } else {
        dispatch(upsertOngoingGame(game as IndexedYahtzee));
      }
      return game;
    } catch (error) {
      throw error;
    }
  }
);

// Join a game
export const joinGame = createAsyncThunk(
  'games/join',
  async ({ game, player }: { game: IndexedYahtzeeSpecs, player: string }, { dispatch }) => {
    try {
      const joinedGame = await api.join(game, player);
      if (!joinedGame.pending) {
        dispatch(upsertOngoingGame(joinedGame as IndexedYahtzee));
      }
      return joinedGame;
    } catch (error) {
      throw error;
    }
  }
); 