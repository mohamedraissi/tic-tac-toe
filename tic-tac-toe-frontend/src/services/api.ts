import axios from 'axios';
import { Game, Move, Player } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'multipart/form-data',
    'Accept': 'application/json',
  },
});

// Typage des réponses API
interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

export const createGame = async (playerX: string, playerO: string): Promise<ApiResponse<Game>> => {
  return api.post('/games', {
    player_x_name: playerX,
    player_o_name: playerO,
  });
};

export const makeMove = async (
  gameId: number,
  player: 'X' | 'O',
  row: number,
  col: number
): Promise<ApiResponse<Move>> => {
  return api.post(`/games/${gameId}/moves`, {
    player,
    row,
    col,
  });
};

interface CheckWinnerResponse {
  winner: 'X' | 'O' | null;
  is_draw: boolean;
}

export const checkWinner = async (gameId: number, winner: 'X' | 'O' | null, is_draw: boolean): Promise<ApiResponse<CheckWinnerResponse>> => {
  return api.post(`/games/${gameId}/check-winner`, {
    winner,
    is_draw,
    _method: 'PUT',
  });
};

export const getLeaderboard = async (): Promise<ApiResponse<Player[]>> => {
  return api.get('/leaderboard');
};

export default api;