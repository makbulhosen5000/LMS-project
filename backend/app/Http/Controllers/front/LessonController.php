<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Chapter;
use App\Models\Lesson;
use Illuminate\Http\Request;
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

}
