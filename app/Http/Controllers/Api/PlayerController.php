<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Player;
use Illuminate\Http\Request;

class PlayerController extends Controller
{
    /**
     * Display a listing of players (leaderboard).
     */
    public function leaderboard()
    {
        $players = Player::orderBy('wins', 'desc')
            ->orderBy('draws', 'desc')
            ->limit(10)
            ->get();

        return response()->json($players);
    }

    /**
     * Display the specified player.
     */
    public function show(Player $player)
    {
        return response()->json($player);
    }
}