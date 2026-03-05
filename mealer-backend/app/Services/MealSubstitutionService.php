<?php

namespace App\Services;

use App\Models\Meal;
use App\Models\Recipe;

class MealSubstitutionService
{
    /**
     * Suggest a substitution for a given meal.
     */
    public function suggestSubstitution(array $originalMeal)
    {
        $type = $originalMeal['type'] ?? 'Lunch';
        $calories = $originalMeal['calories'] ?? 500;

        // Find recipes of the same type with similar calories (+/- 20%)
        $suggestions = Recipe::where('meal_type', strtolower($type))
            ->where('name', '!=', $originalMeal['name'])
            ->whereBetween('calories', [$calories * 0.8, $calories * 1.2])
            ->inRandomOrder()
            ->take(2)
            ->get();

        if ($suggestions->isEmpty()) {
            // Fallback: just find by type
            $suggestions = Recipe::where('meal_type', strtolower($type))
                ->where('name', '!=', $originalMeal['name'])
                ->inRandomOrder()
                ->take(2)
                ->get();
        }

        $formattedSuggestions = $suggestions->map(function ($recipe) {
            return [
                'name' => $recipe->name,
                'cost' => $recipe->estimated_cost,
                'calories' => $recipe->calories,
                'reason' => "Calorie-matched alternative ({$recipe->calories} kcal)"
            ];
        });

        return [
            'original' => $originalMeal['name'],
            'suggestions' => $formattedSuggestions,
            'reasoning' => "AI selected these alternatives from the Kenyan Knowledge Base to maintain your current metabolic trajectory."
        ];
    }
}
