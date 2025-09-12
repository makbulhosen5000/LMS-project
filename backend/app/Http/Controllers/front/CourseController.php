<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Course;
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
        $course->title = $request->title;
        $course->status = 0;
        $course->user_id = $request->user()->id;
        $course->save();
        return response()->json([
            'status' => 200,
            'message' => 'Course created successfully',
            'data' => $course,
        ], 200);
    }
}
