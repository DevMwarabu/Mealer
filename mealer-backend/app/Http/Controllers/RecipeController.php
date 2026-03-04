<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Recipe; // Assuming Recipe model exists

class RecipeController extends Controller
{
    public function communityFeed(Request $request)
    {
        return response()->json([
            'trending' => [
                ['id' => 1, 'author' => 'ChefSarah', 'name' => 'High-Protein Quinoa Bowl', 'likes' => 342, 'health_score' => 96, 'cost' => 'KES 450', 'tags' => ['Vegan', 'High Protein']],
                ['id' => 2, 'author' => 'FitMike', 'name' => 'Low-Carb Turkey Wraps', 'likes' => 215, 'health_score' => 88, 'cost' => 'KES 320', 'tags' => ['Keto', 'Quick']],
                ['id' => 3, 'author' => 'BudgetEats', 'name' => 'Lentil Curry', 'likes' => 512, 'health_score' => 92, 'cost' => 'KES 180', 'tags' => ['Budget', 'Fiber']],
            ],
            'user_shared' => [
                ['id' => 4, 'name' => 'My Power Breakfast', 'likes' => 12, 'views' => 45]
            ]
        ]);
    }
}
