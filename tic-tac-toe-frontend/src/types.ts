// Types pour les données du backend
export interface Player {
    id: number;
    name: string;
    wins: number;
    losses: number;
    draws: number;
    created_at?: string;
    updated_at?: string;
  }
  
  export interface Move {
    id: number;
    game_id: number;
    player_id: number;
    row: number;
    col: number;
    created_at?: string;
    updated_at?: string;
  }
  
  export interface Game {
    id: number;
    player_x_id: number;
    player_o_id: number;
    winner_id: number | null;
    is_draw: boolean;
    completed_at: string | null;
    created_at?: string;
    updated_at?: string;
    player_x?: Player;
    player_o?: Player;
    winner?: Player | null;
    moves?: Move[];
  }
  
  export type Board = (string | null)[][];
  
  // Types pour le state du jeu
  export interface GameState {
    game: Game | null;
    board: Board;
    currentPlayer: 'X' | 'O';
    winner: 'X' | 'O' | null;
    isDraw: boolean;
    players: {
      x: string;
      o: string;
    };
  }
  
  export interface LeaderboardState {
    players: Player[];
    loading: boolean;
    error: string | null;
  }