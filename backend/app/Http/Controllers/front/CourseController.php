<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Course;
use App\Models\Language;
use App\Models\Level;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;


class CourseController extends Controller
{
    // this method return all course for specific user 
    public function index(){

    }
    // this method store a course in DB
    public function store(Request $request){
        $rule = [
            'title' => 'required|string|max:255',
        ];
        $validator = Validator::make($request->all(), $rule);
        if ($validator->fails()) {
            return response()->json([
                'status' => 404,
                'message' => $validator->errors()->first(),
            ], 404);
        }
        $course = new Course();
        $course->title = $request->input('title');
        $course->status = 0;
        $course->user_id = $request->user()->id;
        $course->save();
        return response()->json([
            'status' => 200,
            'data' => $course,
            'message' => 'Course created successfully',
        ], 200);
    }
     
    // this method return a specific course by id
    public function show($id){
        $course = Course::find($id);
        if (!$course) {
            return response()->json([
                'status' => 404,
                'message' => 'Course not found',
            ], 404);
        }
        return response()->json([
            'status' => 200,
            'data' => $course,
        ], 200);
    }
    // this method update a specific course by id
    public function update($id, Request $request)
    {
    $course = Course::find($id);
    if (!$course) {
        return response()->json([
            'message' => 'Course not found',
        ], 404);
    }

    $rules = [
        'title' => 'required|string|max:255',
        'category' => 'required|integer',
        'level' => 'required|integer',
        'language' => 'required|integer',
        'price' => 'required|numeric',
    ];

    $validator = Validator::make($request->all(), $rules);

    if ($validator->fails()) {
        return response()->json([
            'message' => 'Validation failed',
            'errors' => $validator->errors(),
        ], 422);
    }

    $course->title = $request->title;
    $course->category_id = $request->category;
    $course->level_id = $request->level;
    $course->language_id = $request->language;
    $course->price = $request->price;

    if ($request->has('description')) {
        $course->description = $request->description;
    }
    if ($request->has('cross_price')) {
        $course->cross_price = $request->cross_price;
    }

    $course->save();

    return response()->json([
        'message' => 'Course updated successfully',
        'data' => $course,
    ], 200);
}

    // this method return categories,language and level metadata  
    public function metaData(){
        $categories = Category::all();
        $levels = Level::all();
        $languages = Language::all();

        return response()->json([
            'status' => 200,
            'categories' => $categories,
            'levels' => $levels,
            'languages' => $languages,
        ], 200);
    }
}
