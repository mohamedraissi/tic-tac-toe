import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Star } from 'lucide-react';
import Leaderboard from './Leaderboard';
import { Player } from '../types';

interface PlayerFormProps {
  onStart: (playerX: string, playerO: string) => void;
  leaderboard?: Player[];
}

const PlayerForm: React.FC<PlayerFormProps> = ({ onStart, leaderboard = [] }) => {
  const [playerX, setPlayerX] = useState('');
  const [playerO, setPlayerO] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerX && playerO) {
      onStart(playerX, playerO);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight">Tic Tac Toe</h2>
        <p className="text-muted-foreground">
          Enter player names to start the game
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="playerX">Player X</Label>
          <Input
            id="playerX"
            value={playerX}
            onChange={(e) => setPlayerX(e.target.value)}
            placeholder="Enter name for Player X"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="playerO">Player O</Label>
          <Input
            id="playerO"
            value={playerO}
            onChange={(e) => setPlayerO(e.target.value)}
            placeholder="Enter name for Player O"
            required
          />
        </div>

        <Button type="submit" className="w-full">
          Start Game
        </Button>
      </form>

      <div className="text-center">
        <Dialog>
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
            <Leaderboard players={leaderboard} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PlayerForm;