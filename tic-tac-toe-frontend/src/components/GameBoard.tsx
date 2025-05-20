import React, { useState, useEffect, lazy, Suspense } from 'react';
import { checkWinner as checkServerWinner, getLeaderboard } from '../services/api';
import { Game, Board, Player } from '../types';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import { Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import Leaderboard from './Leaderboard';

const ReactConfetti = lazy(() => import('react-confetti'));

interface GameBoardProps {
  game: Game;
  players: {
    x: string;
    o: string;
  };
  onNewGame: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ game, players, onNewGame }) => {
  const [board, setBoard] = useState<Board>(Array(3).fill(null).map(() => Array(3).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<'X' | 'O' | null>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Initialize board from game moves
    if (game.moves) {
      const newBoard: Board = Array(3).fill(null).map(() => Array(3).fill(null));
      game.moves.forEach(move => {
        const playerSymbol = move.player_id === game.player_x_id ? 'X' : 'O';
        newBoard[move.row][move.col] = playerSymbol;
      });
      setBoard(newBoard);
      
      // Determine current player
      const xMoves = game.moves.filter(m => m.player_id === game.player_x_id).length;
      const oMoves = game.moves.filter(m => m.player_id === game.player_o_id).length;
      setCurrentPlayer(xMoves > oMoves ? 'O' : 'X');
    }
  }, [game]);

  const loadLeaderboard = async () => {
    try {
      setIsLoadingLeaderboard(true);
      const response = await getLeaderboard();
      setLeaderboard(response.data);
    } catch (err) {
      setError('Failed to load leaderboard');
      console.error('Error loading leaderboard:', err);
    } finally {
      setIsLoadingLeaderboard(false);
    }
  };

  const handleDialogOpen = (open: boolean) => {
    setIsDialogOpen(open);
    if (open) {
      loadLeaderboard();
    }
  };

  const checkLocalWinner = (board: Board): 'X' | 'O' | null => {
    // Check rows
    for (let i = 0; i < 3; i++) {
      if (board[i][0] && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
        return board[i][0] as 'X' | 'O';
      }
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
      if (board[0][i] && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
        return board[0][i] as 'X' | 'O';
      }
    }

    // Check diagonals
    if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
      return board[0][0] as 'X' | 'O';
    }
    if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
      return board[0][2] as 'X' | 'O';
    }

    return null;
  };

  const checkDraw = (board: Board): boolean => {
    return board.every(row => row.every(cell => cell !== null));
  };

  const handleCellClick = async (row: number, col: number) => {
    if (board[row][col] || winner || isDraw) return;

    // Update board
    const newBoard = [...board];
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);

    // Check for winner
    const newWinner = checkLocalWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
      // Verify with server
      try {
        const winnerResponse = await checkServerWinner(game.id, newWinner, false);
        if (winnerResponse?.data?.winner !== newWinner) {
          setError('Game state mismatch with server');
        }
      } catch (err) {
        setError('Failed to verify game state with server');
        console.error('Error verifying game state:', err);
      }
    } else if (checkDraw(newBoard)) {
      setIsDraw(true);
      // Verify with server
      try {
        const winnerResponse = await checkServerWinner(game.id, null, true);
        if (!winnerResponse?.data?.is_draw) {
          setError('Game state mismatch with server');
        }
      } catch (err) {
        setError('Failed to verify game state with server');
        console.error('Error verifying game state:', err);
      }
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  if (error) return <div className="text-destructive text-center p-4">{error}</div>;

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6">
      {winner && (
        <Suspense fallback={null}>
          <ReactConfetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={200}
            gravity={0.3}
          />
        </Suspense>
      )}
      
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight">Game Board</h2>
        <p className="text-muted-foreground">
          {winner 
            ? `Winner: ${winner === 'X' ? players.x : players.o}`
            : isDraw 
              ? "Game ended in a draw!"
              : `Current player: ${currentPlayer === 'X' ? players.x : players.o}`
          }
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 aspect-square">
        {board.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <Button
              key={`${rowIndex}-${colIndex}`}
              variant="outline"
              size="lg"
              className={cn(
                "h-full w-full text-4xl font-bold transition-all",
                "hover:bg-muted/50 disabled:hover:bg-background",
                cell === 'X' && "text-blue-600",
                cell === 'O' && "text-red-600",
                !cell && !winner && !isDraw && "hover:scale-105"
              )}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              disabled={!!cell || !!winner || isDraw}
            >
              {cell}
            </Button>
          ))
        ))}
      </div>

      <div className="flex flex-col items-center gap-4">
        {(winner || isDraw) && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="default"
              onClick={() => {
                setBoard(Array(3).fill(null).map(() => Array(3).fill(null)));
                setWinner(null);
                setIsDraw(false);
                setCurrentPlayer('X');
              }}
            >
              Play Again
            </Button>
            <Button
              variant="outline"
              onClick={onNewGame}
            >
              New Game with New Players
            </Button>
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="link" 
              className="text-muted-foreground hover:text-primary group inline-flex items-center gap-2"
            >
              <span className="animate-bounce inline-block">Click for Leaderboard</span>
              <Star className="w-5 h-5 text-yellow-400 group-hover:scale-110 transition-transform" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Leaderboard</DialogTitle>
            </DialogHeader>
            {isLoadingLeaderboard ? (
              <div className="flex justify-center items-center min-h-[200px]">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-4 border-primary/20"></div>
                  <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin absolute top-0 left-0"></div>
                </div>
              </div>
            ) : (
              <Leaderboard players={leaderboard} />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default GameBoard;