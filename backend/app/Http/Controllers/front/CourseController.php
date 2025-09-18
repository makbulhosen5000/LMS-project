<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Course;
use App\Models\Language;
use App\Models\Level;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

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
        $course = Course::with(relations: 'chapters')->find($id);
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

    // this method upload and save course image
    public function saveCourseImage($id, Request $request)
    {
    $course = Course::find($id);
    if (!$course) {
        return response()->json([
            'status' => 404,
            'message' => 'Course not found',
        ], 404);
    }

    $rule = [
        'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
    ];
    $validator = Validator::make($request->all(), $rule);
    if ($validator->fails()) {
        return response()->json([
            'status' => 422,
            'message' => $validator->errors()->first(),
        ], 422);
    }

    // delete old image
    if ($course->image != null) {
        if (File::exists(public_path('uploads/course/' . $course->image))) {
            File::delete(public_path('uploads/course/' . $course->image));
        }
        if (File::exists(public_path('uploads/course/small/' . $course->image))) {
            File::delete(public_path('uploads/course/small/' . $course->image));
        }
    }

    // save new image
    $image = $request->file('image');
    $ext = $image->getClientOriginalExtension();
    $imageName = time() . '-' . $id . '.' . $ext;
    $image->move(public_path('uploads/course/'), $imageName);

    // create thumbnail
    $manager = new ImageManager(new Driver());

    // make sure the small folder exists
    if (!File::exists(public_path('uploads/course/small'))) {
        File::makeDirectory(public_path('uploads/course/small'), 0755, true);
    }

    $img = $manager->read(public_path('uploads/course/' . $imageName));
    $img->cover(750, 450); 
    $img->save(public_path('uploads/course/small/' . $imageName));

    // update db
    $course->image = $imageName;
    $course->save();

    return response()->json([
        'status' => 200,
        'data' => $course,
        'message' => 'Course image uploaded successfully',
    ], 200);
    }
}
