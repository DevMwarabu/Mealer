<?php

namespace App\Services;

use App\Models\Meal;
use App\Models\MealItem;
use App\Models\Ingredient;

class MealService
{
    /**
     * Calculate and sync totals for a meal.
     */
    public function updateMealTotals(Meal $meal)
    {
        $items = $meal->items()->with('ingredient')->get();

        $meal->total_cost = number_format($items->sum('cost'), 2, '.', '');
        $meal->total_calories = (int) $items->sum('calories');
        $meal->total_protein = number_format($items->sum(fn($i) => ($i->ingredient->protein / 100) * $i->quantity), 2, '.', '');
        $meal->total_carbs = number_format($items->sum(fn($i) => ($i->ingredient->carbs / 100) * $i->quantity), 2, '.', '');
        $meal->total_fat = number_format($items->sum(fn($i) => ($i->ingredient->fat / 100) * $i->quantity), 2, '.', '');
        $meal->total_sodium = number_format($items->sum(fn($i) => ($i->ingredient->sodium / 100) * $i->quantity), 2, '.', '');
        $meal->total_sugar = number_format($items->sum(fn($i) => ($i->ingredient->sugar / 100) * $i->quantity), 2, '.', '');
        $meal->total_fiber = number_format($items->sum(fn($i) => ($i->ingredient->fiber / 100) * $i->quantity), 2, '.', '');

        // Calculate health score snapshot
        $nutritionService = app(NutritionIntelligenceService::class);
        $meal->health_score_snapshot = number_format($nutritionService->calculateDailyScore($meal->user, $meal->consumed_at), 2, '.', '');

        $meal->save();

        return $meal;
    }
}
