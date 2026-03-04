<?php

namespace App\Services;

use App\Models\User;
use App\Models\Household;

class HouseholdIntelligenceService
{
    /**
     * Sync collective budget across household members.
     */
    public function syncCollectiveBudget($householdId)
    {
        $household = Household::with('users')->find($householdId);
        if (!$household)
            return null;

        $totalSpend = 0;
        foreach ($household->users as $user) {
            $totalSpend += $user->groceries()->where('purchased_at', '>=', now()->startOfMonth())->sum('total_cost');
        }

        return [
            'collective_budget' => $household->collective_monthly_budget,
            'collective_spend' => $totalSpend,
            'remaining' => $household->collective_monthly_budget - $totalSpend,
            'health_score_avg' => $household->users->avg('last_health_score')
        ];
    }

    /**
     * Scale portions for family-sized recipes.
     */
    public function scalePortions($recipe, $householdSize)
    {
        return [
            'original_servings' => 1,
            'target_servings' => $householdSize,
            'multiplier' => $householdSize,
            'waste_reduction_tip' => 'Cook in bulk and freeze 2 portions for Wednesday lunch.'
        ];
    }

    /**
     * Share grocery tasks between household members.
     */
    public function distributeGroceryList($householdId, $items)
    {
        $household = Household::with('users')->find($householdId);
        $users = $household->users;
        $distribution = [];

        foreach ($items as $index => $item) {
            $assignedUser = $users[$index % count($users)];
            $distribution[] = [
                'item' => $item,
                'assigned_to' => $assignedUser->name
            ];
        }

        return $distribution;
    }
}
