import React, { useState, useEffect } from 'react';
import PlayerForm from './components/PlayerForm';
import GameBoard from './components/GameBoard';
import GameStatus from './components/GameStatus';
import Loading from './components/ui/loading';
import { createGame, getLeaderboard } from './services/api';
import { Game, Player } from './types';

const App: React.FC = () => {
  const [game, setGame] = useState<Game | null>(null);
  const [players, setPlayers] = useState({ x: '', o: '' });
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startGame = async (playerX: string, playerO: string) => {
    try {
      setLoading(true);
      const response = await createGame(playerX, playerO);
      setGame(response.data);
      setPlayers({ x: playerX, o: playerO });
      await loadLeaderboard();
    } catch (err) {
      setError('Failed to start game');
      console.error('Error starting game:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewGame = () => {
    setGame(null);
    setPlayers({ x: '', o: '' });
  };

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await getLeaderboard();
      setLeaderboard(response.data);
    } catch (err) {
      setError('Failed to load leaderboard');
      console.error('Error loading leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, []);

  if (loading) return <div className="flex justify-center items-center flex-col h-screen"><Loading /><p>X & O <span className="text-muted-foreground">by med Raissi</span></p></div>;
  if (error) return <div className="text-destructive text-center p-4">{error}</div>;

  return (
    <div className="app">
      {!game ? (
        <PlayerForm onStart={startGame} leaderboard={leaderboard} />
      ) : (
        <>
          <GameBoard 
            game={game} 
            players={players} 
            onNewGame={handleNewGame}
          />
          <GameStatus game={game} players={players} />
        </>
      )}
    </div>
  );
};

export default App;