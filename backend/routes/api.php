<?php

use App\Http\Controllers\front\ChapterController;
use App\Http\Controllers\front\CourseController;
use App\Http\Controllers\front\LessonController;
use App\Http\Controllers\front\OutcomeController;
use App\Http\Controllers\front\RequirementController;
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
    // courses route
    Route::post('/courses',[CourseController::class,'store']); 
    Route::get('/courses/meta-data',[CourseController::class,'metaData']); 
    Route::get('/courses/{id}',[CourseController::class,'show']); 
    Route::put('/courses/{id}',[CourseController::class,'update']); 
    // course image upload
    Route::post('/save-course-image/{id}',[CourseController::class,'saveCourseImage']);

    
    // outcome routes
    Route::get('/outcomes',[OutcomeController::class,'index']);
    Route::post('/outcomes',[OutcomeController::class,'store']);
    Route::put('/outcomes/{id}',[OutcomeController::class,'update']);
    Route::delete('/outcomes/{id}',[OutcomeController::class,'destroy']);
    Route::post('/sort-outcomes',[OutcomeController::class,'sortOutcome']);

     // requirement routes
     Route::get('/requirements',[RequirementController::class,'index']);
     Route::post('/requirements',[RequirementController::class,'store']);
     Route::put('/requirements/{id}',[RequirementController::class,'update']);
     Route::delete('/requirements/{id}',[RequirementController::class,'destroy']);
     Route::post('/sort-requirements',[RequirementController::class,'sortRequirement']);
    
    // chapter routes
    Route::get('/chapters',[ChapterController::class,'index']);
    Route::post('/chapters',[ChapterController::class,'store']);
    Route::put('/chapters/{id}',[ChapterController::class,'update']);
    Route::delete('/chapters/{id}',[ChapterController::class,'destroy']);
    Route::post('/sort-chapters',[ChapterController::class,'sortChapter']);

     // chapter routes
     
     Route::post('/lessons',[LessonController::class,'store']);
     Route::get('/lessons/{id}',[LessonController::class,'show']);
     Route::put('/lessons/{id}',[LessonController::class,'update']);
     Route::delete('/lessons/{id}',[LessonController::class,'update']);

     
});