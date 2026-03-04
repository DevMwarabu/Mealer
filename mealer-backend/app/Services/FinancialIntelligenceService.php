<?php

namespace App\Services;

use App\Models\User;
use Carbon\Carbon;

class FinancialIntelligenceService
{
    /**
     * Analyze budget vs spending efficiency.
     */
    public function getBudgetEfficiency(User $user, $date = null)
    {
        $date = $date ?: Carbon::today();
        $monthlyBudget = $user->monthly_budget_target ?: 1;
        $dailyBudget = $monthlyBudget / 30;

        $dailySpending = $user->meals()->whereDate('consumed_at', $date)->sum('total_cost');

        if ($dailySpending <= $dailyBudget) {
            return 100;
        }

        $overSpend = ($dailySpending - $dailyBudget) / $dailyBudget * 100;
        return max(0, 100 - $overSpend);
    }

    /**
     * Calculate cost per nutritional unit.
     */
    public function getCostPerMacro(User $user, $macro = 'protein')
    {
        $meals = $user->meals()->whereNotNull("total_{$macro}")->take(10)->get();
        if ($meals->isEmpty())
            return 0;

        $totalCost = $meals->sum('total_cost');
        $totalMacro = $meals->sum("total_{$macro}");

        return $totalMacro > 0 ? ($totalCost / $totalMacro) : 0;
    }

    /**
     * Calculate money lost to expired items.
     */
    public function getWasteMetrics(User $user)
    {
        $expiredItems = \DB::table('grocery_items')
            ->join('groceries', 'grocery_items.grocery_id', '=', 'groceries.id')
            ->where('groceries.user_id', $user->id)
            ->where('expiry_date', '<', Carbon::now())
            ->get();

        $totalLost = $expiredItems->sum('price');
        $totalGrocerySpend = $user->groceries()->sum('total_amount');

        $wasteRatio = $totalGrocerySpend > 0
            ? ($totalLost / $totalGrocerySpend) * 100
            : 0;

        return [
            'total_lost' => $totalLost,
            'waste_ratio' => round($wasteRatio, 1),
            'risk_level' => $wasteRatio > 10 ? 'High' : ($wasteRatio > 5 ? 'Medium' : 'Low'),
        ];
    }

    /**
     * Calculate ROI on bulk purchases (items with quantity > 1kg/unit).
     */
    public function getBulkROI(User $user)
    {
        return 12.4; // Mocked logic: Comparing bulk prices vs historical unit averages
    }

    /**
     * Rank foods by nutritional density per currency unit.
     */
    public function getNutritionalEfficiency(User $user)
    {
        $ingredients = \App\Models\Ingredient::orderBy('protein', 'desc')->take(5)->get();
        return $ingredients->map(fn($i) => [
            'name' => $i->name,
            'score' => $i->avg_price > 0 ? round(($i->protein / $i->avg_price) * 100, 2) : 0
        ]);
    }
}
