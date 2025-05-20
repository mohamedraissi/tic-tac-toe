<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\Move;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class MoveController extends Controller
{
    /**
     * Store a newly created move.
     */
    public function store(Request $request, Game $game)
    {
        $request->validate([
            'player' => ['required', Rule::in(['X', 'O'])],
            'row' => 'required|integer|between:0,2',
            'col' => 'required|integer|between:0,2',
        ]);

        $lastMove = $game->moves()->latest()->first();
        if ($lastMove) {
            $lastPlayer = $lastMove->player_id === $game->player_x_id ? 'X' : 'O';
            if ($lastPlayer === $request->player) {
                return response()->json([
                    'message' => "Ce n'est pas le tour de ce joueur"
                ], 422);
            }
        } elseif ($request->player !== 'X') {
            return response()->json([
                'message' => 'Le joueur X doit commencer'
            ], 422);
        }

        $existingMove = $game->moves()
            ->where('row', $request->row)
            ->where('col', $request->col)
            ->exists();
            
        if ($existingMove) {
            return response()->json([
                'message' => 'Cette case est déjà occupée'
            ], 422);
        }

        if ($game->winner_id || $game->is_draw) {
            return response()->json([
                'message' => 'La partie est déjà terminée'
            ], 422);
        }

        return DB::transaction(function () use ($request, $game) {
            $playerId = $request->player === 'X' ? $game->player_x_id : $game->player_o_id;
            
            $move = Move::create([
                'game_id' => $game->id,
                'player_id' => $playerId,
                'row' => $request->row,
                'col' => $request->col,
            ]);

            return response()->json($move, 201);
        });
    }
}