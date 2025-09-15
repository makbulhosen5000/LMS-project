<?php

use App\Http\Controllers\front\CourseController;
use App\Http\Controllers\front\OutcomeController;
use App\Http\Controllers\front\UserAuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// user auth routes here
Route::post('/user/register',[UserAuthController::class,'register']);
Route::post('/user/login',[UserAuthController::class,'authenticate']);


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


// middleware for user routes
Route::group(['middleware' => ['auth:sanctum']],function(){
    // user courses route
    Route::post('/courses',[CourseController::class,'store']); 
    Route::get('/courses/meta-data',[CourseController::class,'metaData']); 
    Route::get('/courses/{id}',[CourseController::class,'show']); 
    Route::put('/courses/{id}',[CourseController::class,'update']); 
    // outcome routes
    Route::get('/outcomes',[OutcomeController::class,'index']);
    Route::post('/outcomes',[OutcomeController::class,'store']);
    Route::put('/outcomes/{id}',[OutcomeController::class,'update']);
    Route::delete('/outcomes/{id}',[OutcomeController::class,'destroy']);
});