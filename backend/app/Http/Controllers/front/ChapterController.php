<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Chapter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ChapterController extends Controller
{
    // this method return all chapter
    public function index(Request $request){
       $chapter = Chapter::where('course_id', request()->course_id)
                          ->orderBy('sort_order','DESC')->get();
       return response()->json([
        "status"=>200,
        "data"=>$chapter
       ]);
    }
    // this method store chapter
    public function store(Request $request){
        $validator = Validator::make($request->all(),[
            'chapter'=>'required',
            'course_id'=>'required',
        ]);
        if($validator->fails()){
            return response()->json([
                "status"=>422,
                "errors"=>$validator->messages()
            ]);
        }

        $chapter = new Chapter();
        $chapter->course_id = $request->course_id;
        $chapter->title = $request->chapter;
        $chapter->sort_order = 1000;
        $chapter->save();

        return response()->json([
            'status' => 200,
            'message' => 'Chapter created successfully',
            'data' => $chapter
        ], 200);
    }
    // this method update chapter
    public function update(Request $request, $id)
{
    $chapter = chapter::find($id);

    if (!$chapter) {
        return response()->json([
            "status" => 404,
            "message" => "chapter not found"
        ], 404);
    }

    $validator = Validator::make($request->all(), [
        'chapter'   => 'required|string|max:255',
        'course_id' => 'sometimes|exists:courses,id',
    ]);

    if ($validator->fails()) {
        return response()->json([
            "status" => 422,
            "errors" => $validator->messages()
        ], 422);
    }

    // Update fields
    $chapter->course_id = $request->course_id;
    $chapter->title = $request->chapter;

    $chapter->save();

    return response()->json([
        "status" => 200,
        "message" => "chapter updated successfully",
        "data" => $chapter
    ], 200);
}


    // this method delete chapter
    public function destroy($id){
        $chapter = chapter::find($id);
        if(!$chapter){
            return response()->json([
                "status"=>404,
                "message"=>"chapter not found"
            ]);
        }
        $chapter->delete();
        return response()->json([
            "status"=>200,
            "message"=>"chapter deleted successfully"
        ]);
    }

    //this method will sort chapter
    public function sortChapter(Request $request){
        if(!empty($request->chapters)){
            foreach($request->chapters as $key => $chapter){
                chapter::where('id',$chapter['id'])->update(['sort_order'=>$key]);
            }
            return response()->json([
                "status"=>200,
                "message"=>"Chapter sorted successfully"
            ]);
        }
    }
}
