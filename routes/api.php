<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

 // Games routes
 Route::get('/games', [\App\Http\Controllers\Api\GameController::class, 'index']);
 Route::post('/games', [\App\Http\Controllers\Api\GameController::class, 'store']);
 Route::get('/games/{game}', [\App\Http\Controllers\Api\GameController::class, 'show']);
 Route::put('/games/{game}/check-winner', [\App\Http\Controllers\Api\GameController::class, 'checkWinner']);
 
 // Moves routes
 Route::post('/games/{game}/moves', [\App\Http\Controllers\Api\MoveController::class, 'store']);
 
 // Players routes
 Route::get('/leaderboard', [\App\Http\Controllers\Api\PlayerController::class, 'leaderboard']);
 Route::get('/players/{player}', [\App\Http\Controllers\Api\PlayerController::class, 'show']);