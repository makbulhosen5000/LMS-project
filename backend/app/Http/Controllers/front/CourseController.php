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
    public function update($id,Request $request){
        
        $course = Course::find($id);
        if (!$course) {
            return response()->json([
                'status' => 404,
                'message' => 'Course not found',
            ], 404);
        }

        $rule = [
            'title' => 'required',
            'category' => 'required',
            'level' => 'required',
            'language' => 'required',
            'price' => 'required',
        ];
        $validator = Validator::make($request->all(), $rule);
        if ($validator->fails()) {
            return response()->json([
                'status' => 404,
                'message' => $validator->errors()->first(),
            ], 404);
        }
        $course->title = $request->input(key: 'title');
        $course->category_id = $request->input(key: 'category');
        $course->level_id = $request->input(key: 'level');
        $course->language_id = $request->input(key: 'language');
        $course->description = $request->input(key: 'description');
        $course->price = $request->input(key: 'price');
        $course->cross_price = $request->input(key: 'cross_price');
        $course->save();
        return response()->json([
            'status' => 200,
            'data' => $course,
            'message' => 'Course Updated successfully',
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
