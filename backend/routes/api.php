<?php

use App\Http\Controllers\front\UserAuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// user auth routes here
Route::post('/user/register',[UserAuthController::class,'register']);
Route::post('/user/login',[UserAuthController::class,'authenticate']);


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
