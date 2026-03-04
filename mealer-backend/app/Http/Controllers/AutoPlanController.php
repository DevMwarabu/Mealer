<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\AIIntelligenceService;
use App\Services\DynamicRecalculationService;

class AutoPlanController extends Controller
{
    protected $aiService;
    protected $dynamicService;

    public function __construct(AIIntelligenceService $aiService, DynamicRecalculationService $dynamicService)
    {
        $this->aiService = $aiService;
        $this->dynamicService = $dynamicService;
    }

    /**
     * Generate the initial 30-day baseline plan upon onboarding.
     */
    public function generateBaseline(Request $request)
    {
        // In full flow, this takes User ID, Country, Budget, Goals
        // $user = $request->user();

        // Mock User for UI testing
        $user = new \App\Models\User([
            'country' => 'Kenya',
            'monthly_budget_target' => 20000,
            'name' => 'Demo User'
        ]);

        $plan = $this->aiService->generateMonthlyPlan($user);

        return response()->json([
            'message' => 'Intelligence Baseline Established',
            'plan' => $plan
        ]);
    }

    /**
     * Today's specific plan overview.
     */
    public function getToday(Request $request)
    {
        return response()->json([
            'date' => now()->toDateString(),
            'status' => 'Optimized',
            'meals' => [
                ['id' => 'm1', 'type' => 'Breakfast', 'name' => 'High-Protein Oats & Chia', 'calories' => 420, 'cost' => 'KES 180', 'status' => 'pending'],
                ['id' => 'm2', 'type' => 'Lunch', 'name' => 'Grilled Chicken Salad', 'calories' => 550, 'cost' => 'KES 450', 'status' => 'pending'],
                ['id' => 'm3', 'type' => 'Dinner', 'name' => 'Lentil Stew with Rice', 'calories' => 600, 'cost' => 'KES 220', 'status' => 'pending'],
            ],
            'metrics' => [
                'target_calories' => 1950,
                'planned_calories' => 1570,
                'target_cost' => 1000,
                'planned_cost' => 850
            ]
        ]);
    }

    /**
     * Recalculate remaining daily plan based on a deviation.
     */
    public function recalculate(Request $request)
    {
        $deviationData = $request->validate([
            'reason' => 'required|string',
            'action' => 'required|string',
            'meal_id' => 'required|string'
        ]);

        $user = new \App\Models\User([
            'country' => 'Kenya',
            'monthly_budget_target' => 20000,
            'name' => 'Demo User'
        ]);

        $recalculated = $this->dynamicService->recalculateForDeviation($user, $deviationData);

        return response()->json([
            'message' => 'Intelligence Engine Rebalanced',
            'data' => $recalculated
        ]);
    }
}
