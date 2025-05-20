import React from 'react';
import { Game } from '../types';

interface GameStatusProps {
  game: Game;
  players: {
    x: string;
    o: string;
  };
  winner?: 'X' | 'O' | null;
  isDraw?: boolean;
  currentPlayer?: 'X' | 'O';
}

const GameStatus: React.FC<GameStatusProps> = ({ 
  game, 
  players, 
  winner, 
  isDraw, 
  currentPlayer = 'X' 
}) => {
  if (!game) return null;

  return (
    <div className="game-status">
      {winner && (
        <p>{winner === 'X' ? players.x : players.o} wins!</p>
      ) }
      {isDraw && (
        <p>It's a draw!</p>
      )}
    </div>
  );
};

export default GameStatus;