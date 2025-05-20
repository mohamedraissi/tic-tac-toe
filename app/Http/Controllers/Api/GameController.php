<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\Player;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GameController extends Controller
{
    /**
     * Display a listing of all games.
     */
    public function index()
    {
        $games = Game::with(['playerX', 'playerO', 'winner', 'moves'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($games);
    }

    /**
     * Store a newly created game.
     */
    public function store(Request $request)
    {
        $request->validate([
            'player_x_name' => 'required|string|max:255',
            'player_o_name' => 'required|string|max:255',
        ]);

        return DB::transaction(function () use ($request) {
            $playerX = Player::firstOrCreate(['name' => $request->player_x_name]);
            $playerO = Player::firstOrCreate(['name' => $request->player_o_name]);

            $game = Game::create([
                'player_x_id' => $playerX->id,
                'player_o_id' => $playerO->id,
            ]);

            return response()->json($game->load(['playerX', 'playerO']), 201);
        });
    }

    /**
     * Display the specified game.
     */
    public function show(Game $game)
    {
        return response()->json($game->load(['playerX', 'playerO', 'winner', 'moves.player']));
    }

    /**
     * Check if there's a winner for the specified game.
     */
    public function checkWinner(Game $game, Request $request)
    {
        if($request->winner=="X")
        {
            $winner_id = $game->player_x_id;
            $loser_id = $game->player_o_id;
        }
        else if($request->winner=="O"){
            $winner_id = $game->player_o_id;
            $loser_id = $game->player_x_id;
        }

        if($request->winner) {
            
            $game->update(['winner_id' => $winner_id, 'completed_at' => now()]);
            
            Player::where('id', $winner_id)->increment('wins');
            Player::where('id', $loser_id)->increment('losses');

            return response()->json([
                'winner' => $request->winner,
                'is_draw' => false,
            ]);
        }
        
        if ($request->is_draw) {
            $game->update(['is_draw' => true, 'completed_at' => now()]);
            
            Player::where('id', $game->player_x_id)->increment('draws');
            Player::where('id', $game->player_o_id)->increment('draws');

            return response()->json([
                'is_draw' => true,
                'winner' => null
            ]);
        }
    }

}