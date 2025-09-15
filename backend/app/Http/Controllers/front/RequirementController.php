<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Requirement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RequirementController extends Controller
{
    // this method return all requirement
    public function index(Request $request){
       $requirement = Requirement::where('course_id', request()->course_id)->get();
       return response()->json([
        "status"=>200,
        "data"=>$requirement
       ]);
    }
    // this method store requirement
    public function store(Request $request){
        $validator = Validator::make($request->all(),[
            'requirement'=>'required',
            'course_id'=>'required',
        ]);
        if($validator->fails()){
            return response()->json([
                "status"=>422,
                "errors"=>$validator->messages()
            ]);
        }

        $requirement = new Requirement();
        $requirement->course_id = $request->course_id;
        $requirement->description = $request->requirement;
        $requirement->sort_order = 1000;
        $requirement->save();

        return response()->json([
            'status' => 200,
            'message' => 'Requirement created successfully',
            'data' => $requirement
        ], 200);
    }
    // this method update requirement
    public function update(Request $request, $id)
{
    $requirement = Requirement::find($id);

    if (!$requirement) {
        return response()->json([
            "status" => 404,
            "message" => "requirement not found"
        ], 404);
    }

    $validator = Validator::make($request->all(), [
        'requirement'   => 'required|string|max:255',
        'course_id' => 'sometimes|exists:courses,id',
    ]);

    if ($validator->fails()) {
        return response()->json([
            "status" => 422,
            "errors" => $validator->messages()
        ], 422);
    }

    // Update fields
    $requirement->course_id = $request->course_id;
    $requirement->description = $request->requirement;

    $requirement->save();

    return response()->json([
        "status" => 200,
        "message" => "Requirement updated successfully",
        "data" => $requirement
    ], 200);
}


    // this method delete requirement
    public function destroy($id){
        $requirement = requirement::find($id);
        if(!$requirement){
            return response()->json([
                "status"=>404,
                "message"=>"Requirement not found"
            ]);
        }
        $requirement->delete();
        return response()->json([
            "status"=>200,
            "message"=>"Requirement deleted successfully"
        ]);
    }
}
