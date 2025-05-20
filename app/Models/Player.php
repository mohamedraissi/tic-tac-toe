<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Player extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'wins',
        'losses',
        'draws'
    ];

    public function gamesAsX()
    {
        return $this->hasMany(Game::class, 'player_x_id');
    }

    public function gamesAsO()
    {
        return $this->hasMany(Game::class, 'player_o_id');
    }

    public function wonGames()
    {
        return $this->hasMany(Game::class, 'winner_id');
    }

    public function moves()
    {
        return $this->hasMany(Move::class);
    }
}