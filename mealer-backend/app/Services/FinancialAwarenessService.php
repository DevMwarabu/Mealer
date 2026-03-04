<?php

namespace App\Services;

use App\Models\Ingredient;
use App\Models\User;

class FinancialAwarenessService
{
    /**
     * Simulate "Inflation Sensitivity" by adjusting prices based on trends.
     */
    public function getInflationAdjustedPrice(Ingredient $ingredient, $region = 'Kenya')
    {
        $basePrice = $ingredient->cost_per_unit;
        $trend = $this->getMockInfaltionTrend($ingredient->category_id);

        return $basePrice * (1 + $trend);
    }

    /**
     * Calculate Monthly Budget Stability.
     */
    public function calculateBudgetStability(User $user)
    {
        $budget = $user->monthly_budget_target;
        $currentSpend = $user->groceries()->where('purchased_at', '>=', now()->startOfMonth())->sum('total_cost');

        $usageRatio = $currentSpend / $budget;

        return [
            'spend_ratio' => $usageRatio,
            'is_stable' => $usageRatio < (now()->day / now()->daysInMonth) + 0.1,
            'projected_overrun' => max(0, ($currentSpend / now()->day * now()->daysInMonth) - $budget)
        ];
    }

    /**
     * Cost Simulator: "What if I increase protein?"
     */
    public function simulateScenario(User $user, $scenario)
    {
        // Mock logic for scenario simulation
        return match ($scenario) {
            'high_protein' => ['cost_increase' => 0.25, 'health_benefit' => 0.15],
            'vegetarian' => ['cost_decrease' => 0.15, 'health_benefit' => 0.10],
            'organic_only' => ['cost_increase' => 0.40, 'health_benefit' => 0.05],
            default => ['cost_increase' => 0, 'health_benefit' => 0],
        };
    }

    /**
     * Suggest cheaper alternatives for an ingredient experiencing high inflation.
     */
    public function suggestAlternatives(Ingredient $ingredient)
    {
        $trend = $this->getMockInfaltionTrend($ingredient->category_id);

        if ($trend <= 0.05) {
            return null; // Inflation within safe bounds
        }

        // Logic: Find similar nutrients but cheaper
        return match ($ingredient->name) {
            'Beef (Lean)' => ['item' => 'Lentils', 'savings' => '75%', 'metabolic_match' => 'High'],
            'Chicken Breast' => ['item' => 'Eggs', 'savings' => '60%', 'metabolic_match' => 'High'],
            'Broccoli' => ['item' => 'Sukuma Wiki (Kale)', 'savings' => '85%', 'metabolic_match' => 'Medium'],
            default => ['item' => 'General Grain Staples', 'savings' => '20%', 'metabolic_match' => 'Varies'],
        };
    }

    private function getMockInfaltionTrend($categoryId)
    {
        // Mock inflation data: Vegetables +4%, Grains +2%, Proteins +8%
        return match ($categoryId) {
            1 => 0.08, // Proteins (High)
            2 => 0.02, // Grains (Low)
            3 => 0.04, // Vegetables (Med)
            default => 0.03
        };
    }
}
