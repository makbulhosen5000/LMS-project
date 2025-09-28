<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;

class LessonController extends Controller
{

    // this method store lesson
    public function store(Request $request){
        $validator = Validator::make($request->all(),[
            'chapter'=>'required',
            'lesson'=>'required',
        ]);
        if($validator->fails()){
            return response()->json([
                "status"=>422,
                "errors"=>$validator->messages()
            ]);
        }

        $lesson = new Lesson();
        $lesson->chapter_id = $request->chapter;
        $lesson->title = $request->lesson;
        $lesson->sort_order = 1000;
        $lesson->status = $request->status;
        $lesson->save();

        return response()->json([
            'status' => 200,
            'message' => 'Lesson created successfully',
            'data' => $lesson
        ], 200);
    }
    // this method will fetch lesson
    public function show($id){
        $lesson = Lesson::find($id);
        if(!$lesson){
            return response()->json([
                "status"=>404,
                "message"=>"lesson not found"
            ],404);
        }
        return response()->json([
            "status"=>200,
            "data"=>$lesson
        ],200);
    }
     // this method update lesson
     public function update(Request $request, $id)
     {
         $lesson = Lesson::find($id);
     
         if (!$lesson) {
             return response()->json([
                 "status" => 404,
                 "message" => "lesson not found"
             ], 404);
         }
     
         $validator = Validator::make($request->all(), [
             'chapter' => 'required',
             'lesson'   => 'required|string|max:255',
         ]);
     
         if ($validator->fails()) {
             return response()->json([
                 "status" => 422,
                 "errors" => $validator->messages()
             ], 422);
         }
     
         // Update fields
         $lesson->chapter_id = $request->chapter;
         $lesson->title = $request->lesson;
         $lesson->is_free_preview =($request->is_free_preview == 'false')? 'no' : 'yes';
         $lesson->duration = $request->duration;
         $lesson->duration = $request->duration;
         $lesson->description = $request->description;
         $lesson->description = $request->description;
         $lesson->status = $request->status;
     
         $lesson->save();
     
         return response()->json([
             "status" => 200,
             "message" => "Lesson updated successfully",
             "data" => $lesson
         ], 200);
     }
    // this method delete chapter
    public function destroy($id)
    {
    $lesson = Lesson::find($id);

    if (!$lesson) {
        return response()->json([
            "status" => 404,
            "message" => "Lesson not found"
        ], 404);
    }

    $lesson->delete();
    return response()->json([
        "status" => 200,
        "message" => "Lesson deleted successfully"
    ], 200);
    }
    
    // this method will upload course lesson video
    public function saveLessonVideo($id, Request $request)
{
    $lesson = Lesson::find($id);
    if (!$lesson) {
        return response()->json([
            'status' => 404,
            'message' => 'Lesson not found',
        ], 404);
    }

    $rules = [
        'video' => 'required',
    ];
    $validator = Validator::make($request->all(), $rules);

    if ($validator->fails()) {
        return response()->json([
            'status' => 422,
            'message' => $validator->errors()->first(),
        ], 422);
    }

    if ($lesson->video && File::exists(public_path('uploads/course/videos/' . $lesson->video))) {
        File::delete(public_path('uploads/course/videos/' . $lesson->video));
    }

    $video = $request->file('video');
    $ext = $video->getClientOriginalExtension();
    $videoName = time() . '-' . $id . '.' . $ext;
    $video->move(public_path('uploads/course/videos'), $videoName);

    $lesson->video = $videoName;
    $lesson->save();

    return response()->json([
        'status' => 200,
        'message' => 'Video uploaded successfully',
        'data' => [
            'video_url' => url('uploads/course/videos/' . $videoName) 
        ]
    ], 200);
}



}
