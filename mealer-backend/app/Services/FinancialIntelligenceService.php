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
     * Calculate ROI on bulk purchases (items with quantity > 1).
     */
    public function getBulkROI(User $user)
    {
        $bulkItems = \DB::table('grocery_items')
            ->join('groceries', 'grocery_items.grocery_id', '=', 'groceries.id')
            ->where('groceries.user_id', $user->id)
            ->where('quantity', '>', 1)
            ->get();

        if ($bulkItems->isEmpty())
            return 0;

        // ROI calculation based on savings vs historical avg_price from ingredients table
        $totalSavings = 0;
        $totalCost = 0;

        foreach ($bulkItems as $item) {
            $ingredient = \App\Models\Ingredient::find($item->ingredient_id);
            if ($ingredient && $ingredient->avg_price > 0) {
                // Approximate unit price in bulk vs standard avg price
                $unitPriceInBulk = $item->price / $item->quantity;
                $savings = ($ingredient->avg_price - $unitPriceInBulk) * $item->quantity;
                $totalSavings += max(0, $savings);
                $totalCost += $item->price;
            }
        }

        return $totalCost > 0 ? round(($totalSavings / $totalCost) * 100, 1) : 0;
    }

    /**
     * Rank foods by nutritional density per currency unit.
     */
    public function getNutritionalEfficiency(User $user)
    {
        $ingredients = \App\Models\Ingredient::where('avg_price', '>', 0)
            ->orderByRaw('protein / avg_price DESC')
            ->take(5)
            ->get();

        return $ingredients->map(fn($i) => [
            'name' => $i->name,
            'score' => round(($i->protein / $i->avg_price) * 100, 2)
        ]);
    }
}
