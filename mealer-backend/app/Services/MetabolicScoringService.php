<?php

namespace App\Services;

use App\Models\Ingredient;
use App\Models\Meal;

class MetabolicScoringService
{
    /**
     * Calculate a comprehensive metabolic score for a meal.
     */
    public function calculateMealMetabolicScore(Meal $meal)
    {
        $ingredients = $meal->items()->with('ingredient')->get()->pluck('ingredient');

        if ($ingredients->isEmpty()) {
            return 0;
        }

        $avgInflammatory = $ingredients->avg('anti_inflammatory_score') ?: 0;
        $avgGutHealth = $ingredients->avg('gut_health_score') ?: 0;
        $avgGlycemic = $this->mapGlycemicImpact($ingredients);
        $avgDensity = $ingredients->avg('nutrient_density_score') ?: 0;

        // Formula: Weighted average of biological markers
        return (
            ($avgInflammatory * 0.3) +
            ($avgGutHealth * 0.3) +
            ($avgDensity * 0.4)
        ) * ($avgGlycemic / 100);
    }

    /**
     * Map string glycemic impact to a multiplier.
     */
    private function mapGlycemicImpact($ingredients)
    {
        $scores = $ingredients->map(function ($ing) {
            return match (strtolower($ing->glycemic_impact)) {
                'low' => 100,
                'medium' => 70,
                'high' => 40,
                default => 80,
            };
        });

        return $scores->avg();
    }

    /**
     * Detect micronutrient gaps based on recent history.
     */
    public function detectNutrientGaps($user, $days = 14)
    {
        $recentMeals = $user->meals()
            ->with('items.ingredient')
            ->where('consumed_at', '>=', now()->subDays($days))
            ->get();

        $totals = [
            'iron' => 0,
            'calcium' => 0,
            'potassium' => 0
        ];

        foreach ($recentMeals as $meal) {
            foreach ($meal->items as $item) {
                $totals['iron'] += $item->ingredient->iron_content_mg * ($item->quantity / 100);
                $totals['calcium'] += $item->ingredient->calcium_content_mg * ($item->quantity / 100);
                $totals['potassium'] += $item->ingredient->potassium_content_mg * ($item->quantity / 100);
            }
        }

        $dailyAvg = array_map(fn($v) => $v / $days, $totals);

        return [
            'iron_gap' => $dailyAvg['iron'] < 15, // Thresholds mock
            'calcium_gap' => $dailyAvg['calcium'] < 1000,
            'potassium_gap' => $dailyAvg['potassium'] < 3000,
            'averages' => $dailyAvg
        ];
    }
}
