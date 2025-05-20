<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    use HasFactory;

    protected $fillable = [
        'player_x_id',
        'player_o_id',
        'winner_id',
        'is_draw',
        'completed_at'
    ];

    protected $dates = ['completed_at'];

    public function playerX()
    {
        return $this->belongsTo(Player::class, 'player_x_id');
    }

    public function playerO()
    {
        return $this->belongsTo(Player::class, 'player_o_id');
    }

    public function winner()
    {
        return $this->belongsTo(Player::class, 'winner_id');
    }

    public function moves()
    {
        return $this->hasMany(Move::class);
    }
}