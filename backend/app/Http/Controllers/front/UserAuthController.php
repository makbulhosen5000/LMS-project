<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
class UserAuthController extends Controller
{
     // get user register function
     public function register(Request $request)
     {
         $rule = [
             'name' => 'required|string|max:255',
             'email' => 'required|string|email|max:255|unique:users',
             'password' => 'required',
 
         ];
         $validator = Validator::make($request->all(), $rule);
         if ($validator->fails()) {
             return response()->json([
                 'status' => 404,
                 'message' => $validator->errors()->first(),
             ], 404);
         }
         $user = new User();
         $user->name = $request->name;
         $user->email = $request->email;
         $user->password = Hash::make($request->password);
         //$user->role ="user";
         $user->save();
         return response()->json([
             'status' => 200,
             'message' => 'User registered successfully',
             'data' => $user,
         ], 200);
     }

     // get user login function
     public function authenticate(Request $request)
     {
         // Validate request
         $request->validate([
             'email' => 'required|email',
             'password' => 'required|min:6',
         ]);
         // Find user by email
         $user = User::where('email', $request->email)->first();
         // Check credentials
         if (!$user || !Hash::check($request->password, $user->password)) {
             return response()->json([
                 'status' => '401',
                 'message' => 'Either email or password is incorrect',
             ], 401);
         }
        //  // Block admin users from logging in here
        //  if ($user->role === 'admin') {
        //      return response()->json([
        //          'status' => '403',
        //          'message' => 'Admin are not allowed to access this login.',
        //      ], 403);
        //  }
 
         // Create Sanctum token
         $token = $user->createToken('token')->plainTextToken;
         
         // Return response
         return response()->json([
             'status' => '200',
             'token' => $token,
             'id' => $user->id,
             'name' => $user->name,
             'email' => $user->email,
         ], 200);
 
     }



}
