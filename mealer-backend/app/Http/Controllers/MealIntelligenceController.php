<?php

namespace App\Http\Controllers;

use App\Services\MealSubstitutionService;
use Illuminate\Http\Request;

class MealIntelligenceController extends Controller
{
    protected $substitutionService;

    public function __construct(MealSubstitutionService $substitutionService)
    {
        $this->substitutionService = $substitutionService;
    }

    public function suggestSubstitution(Request $request)
    {
        $request->validate([
            'meal_name' => 'required|string',
            'type' => 'required|string|in:Breakfast,Lunch,Dinner,Snack'
        ]);

        $originalMeal = [
            'name' => $request->meal_name,
            'type' => $request->type
        ];

        $suggestion = $this->substitutionService->suggestSubstitution($originalMeal);

        return response()->json($suggestion);
    }
}
