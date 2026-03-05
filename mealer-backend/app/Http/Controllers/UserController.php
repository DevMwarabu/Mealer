<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'daily_calorie_target' => 'sometimes|integer|min:500|max:10000',
            'height' => 'sometimes|numeric|min:50|max:300',
            'weight' => 'sometimes|numeric|min:20|max:500',
            'country' => 'sometimes|string|max:255',
            'sodium_target' => 'sometimes|integer|min:0|max:10000',
            'sugar_target' => 'sometimes|integer|min:0|max:1000',
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user->fresh()
        ]);
    }
}
