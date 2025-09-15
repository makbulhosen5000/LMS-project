<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Outcome;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OutcomeController extends Controller
{
    // this method return all outcome
    public function index(Request $request){
       $outcome = Outcome::where('course_id', request()->course_id)->get();
       return response()->json([
        "status"=>200,
        "data"=>$outcome
       ]);
    }
    // this method store outcome
    public function store(Request $request){
        $validator = Validator::make($request->all(),[
            'outcome'=>'required',
            'course_id'=>'required',
        ]);
        if($validator->fails()){
            return response()->json([
                "status"=>422,
                "errors"=>$validator->messages()
            ]);
        }

        $outcome = new Outcome();
        $outcome->course_id = $request->course_id;
        $outcome->text = $request->outcome;
        $outcome->sort_order = 1000;
        $outcome->save();

        return response()->json([
            'status' => 200,
            'message' => 'Outcome created successfully',
            'data' => $outcome
        ], 200);
    }
    // this method update outcome
    public function update(Request $request,$id){
        
        $outcome = Outcome::find($id);
        if(!$outcome){
            return response()->json([
                "status"=>404,
                "message"=>"Outcome not found"
            ]);
        }
        $validator = Validator::make($request->all(),[
            'outcome'=>'required',
        ]);
        if($validator->fails()){
            return response()->json([
                "status"=>422,
                "errors"=>$validator->messages()
            ]);
        }

       
        $outcome->course_id = $request->course_id;
        $outcome->text = $request->outcome;
        $outcome->sort_order = 1000;
        $outcome->save();

        return response()->json([
            "status"=>201,
            "message"=>"Outcome updated successfully",
            "data"=>$outcome
        ]);
    }

    // this method delete outcome
    public function destroy($id){
        $outcome = Outcome::find($id);
        if(!$outcome){
            return response()->json([
                "status"=>404,
                "message"=>"Outcome not found"
            ]);
        }
        $outcome->delete();
        return response()->json([
            "status"=>200,
            "message"=>"Outcome deleted successfully"
        ]);
    }
}
