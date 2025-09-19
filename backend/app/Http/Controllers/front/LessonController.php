<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LessonController extends Controller
{
    // this method store lesson
    public function store(Request $request){
        $validator = Validator::make($request->all(),[
            'lesson'=>'required',
            'chapter_id'=>'required',
        ]);
        if($validator->fails()){
            return response()->json([
                "status"=>422,
                "errors"=>$validator->messages()
            ]);
        }

        $lesson = new Lesson();
        $lesson->chapter_id = $request->chapter_id;
        $lesson->title = $request->lesson;
        $lesson->sort_order = 1000;
        $lesson->save();

        return response()->json([
            'status' => 200,
            'message' => 'lesson created successfully',
            'data' => $lesson
        ], 200);
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
             'lesson'   => 'required|string|max:255',
             'chapter_id' => 'required',
         ]);
     
         if ($validator->fails()) {
             return response()->json([
                 "status" => 422,
                 "errors" => $validator->messages()
             ], 422);
         }
     
         // Update fields
         $lesson->chapter_id = $request->chapter_id;
         $lesson->title = $request->lesson;
         $lesson->is_free =($request->is_free == 'false')? 'no' : 'yes';
     
         $lesson->save();
     
         return response()->json([
             "status" => 200,
             "message" => "chapter updated successfully",
             "data" => $lesson
         ], 200);
         }
}
