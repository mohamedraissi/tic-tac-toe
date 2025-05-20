import React, { useState } from 'react';
import { Player } from '../types';
import { Input } from './ui/input';
import { cn } from '../lib/utils';

interface LeaderboardProps {
  players: Player[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ players }) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!players || players.length === 0) return null;

  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Leaderboard</h2>
        <p className="text-muted-foreground">
          Track player performance and statistics
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <Input
          type="search"
          placeholder="Search players..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Player
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Wins
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Losses
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Draws
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Win Rate
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {filteredPlayers.map((player) => {
                const totalGames = player.wins + player.losses + player.draws;
                const winRate = totalGames > 0 
                  ? ((player.wins / totalGames) * 100).toFixed(1) 
                  : '0.0';

                return (
                  <tr 
                    key={player.id}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <td className="p-4 align-middle font-medium">
                      {player.name}
                    </td>
                    <td className="p-4 align-middle">
                      <span className="text-green-600 font-medium">{player.wins}</span>
                    </td>
                    <td className="p-4 align-middle">
                      <span className="text-red-600 font-medium">{player.losses}</span>
                    </td>
                    <td className="p-4 align-middle">
                      <span className="text-yellow-600 font-medium">{player.draws}</span>
                    </td>
                    <td className="p-4 align-middle">
                      <span className={cn(
                        "font-medium",
                        parseFloat(winRate) >= 50 ? "text-green-600" : "text-red-600"
                      )}>
                        {winRate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;