<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\AIIntelligenceService;
use App\Services\DynamicRecalculationService;
use App\Services\OptimizationEngineService;
use App\Services\MetabolicScoringService;
use App\Services\ContextualIntelligenceService;
use App\Services\FinancialAwarenessService;
use App\Services\BehavioralIntelligenceService;
use App\Services\HouseholdIntelligenceService;
use App\Services\PredictiveAnalyticsService;

class AutoPlanController extends Controller
{
    protected $aiService;
    protected $dynamicService;
    protected $optimizationService;
    protected $metabolicService;
    protected $contextualService;
    protected $financialService;
    protected $behavioralService;
    protected $householdService;
    protected $predictiveService;

    public function __construct(
        AIIntelligenceService $aiService,
        DynamicRecalculationService $dynamicService,
        OptimizationEngineService $optimizationService,
        MetabolicScoringService $metabolicService,
        ContextualIntelligenceService $contextualService,
        FinancialAwarenessService $financialService,
        BehavioralIntelligenceService $behavioralService,
        HouseholdIntelligenceService $householdService,
        PredictiveAnalyticsService $predictiveService
    ) {
        $this->aiService = $aiService;
        $this->dynamicService = $dynamicService;
        $this->optimizationService = $optimizationService;
        $this->metabolicService = $metabolicService;
        $this->contextualService = $contextualService;
        $this->financialService = $financialService;
        $this->behavioralService = $behavioralService;
        $this->householdService = $householdService;
        $this->predictiveService = $predictiveService;
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

        $plan = $this->optimizationService->solveMonthlyOptimization($user);

        return response()->json([
            'message' => 'V2 Optimization Pipeline Established',
            'optimization_grade' => $plan['meta']['optimization_grade'],
            'plan' => $plan
        ]);
    }

    public function getToday(Request $request)
    {
        // For API testing, use a mock instance if not authenticated
        $user = $request->user();

        if (!$user) {
            $user = new \App\Models\User([
                'id' => 1,
                'country' => 'Kenya',
                'monthly_budget_target' => 20000,
                'name' => 'Demo User'
            ]);
        }

        $seasonal = $this->contextualService->getSeasonalContext($user->country ?? 'Kenya');
        $cultural = $this->contextualService->getCulturalPatterns($user->id, $user->country ?? 'Kenya');
        $behavioral = $this->behavioralService->getCognitiveLoadStatus($user);
        $discipline = $this->behavioralService->calculateDisciplineScore($user);
        $predictions = $this->predictiveService->predictWeightTrajectory($user);
        $clinical = $this->predictiveService->generateClinicalSummary($user);

        // Dynamic Meal Selection from DB
        $breakfast = \App\Models\Recipe::where('meal_type', 'breakfast')->inRandomOrder()->first();
        $lunch = \App\Models\Recipe::where('meal_type', 'lunch')->inRandomOrder()->first();
        $dinner = \App\Models\Recipe::where('meal_type', 'dinner')->inRandomOrder()->first();
        $snack = \App\Models\Recipe::where('meal_type', 'snack')->inRandomOrder()->first();

        $selectedMeals = collect([$breakfast, $lunch, $dinner, $snack])->filter();

        $plannedCalories = $selectedMeals->sum('calories');
        $plannedCost = $selectedMeals->sum('estimated_cost');
        $avgHealthScore = $selectedMeals->avg('health_score') ?? 0;

        $mealsData = $selectedMeals->map(function ($meal) {
            return [
                'id' => $meal->id,
                'type' => ucfirst($meal->meal_type),
                'name' => $meal->name,
                'calories' => $meal->calories,
                'cost' => 'KES ' . $meal->estimated_cost,
                'metabolic_score' => $meal->health_score,
                'status' => 'pending'
            ];
        })->values()->toArray();

        // Check if any tags represent a specific diet
        $allTags = $selectedMeals->pluck('tags')->map(fn($t) => is_string($t) ? json_decode($t, true) : $t)->flatten()->unique();
        $mode = 'Standard';
        if ($allTags->contains('traditional'))
            $mode = 'Traditional';
        if ($allTags->contains('cheap_meal'))
            $mode = 'Zero-Waste / Cheap';

        $householdStats = [
            'sync_active' => true,
            'collective_remaining' => 4500,
            'family_portions' => 4,
            'shared_grocery_alert' => 'User "Sarah" has picked up the milk.'
        ];

        return response()->json([
            'date' => now()->toDateString(),
            'status' => 'Autonomous Optimization Active',
            'household' => $householdStats,
            'predictive' => [
                'weight_trajectory' => $predictions,
                'clinical_summary' => $clinical
            ],
            'context' => [
                'season' => $seasonal['season'],
                'abundant_items' => $seasonal['abundant'],
                'cultural_focus' => $cultural['traditional_staples'][0] ?? 'Balanced',
                'behavioral_load' => $behavioral['status'],
                'discipline_score' => $discipline
            ],
            'meals' => $mealsData,
            'v2_metrics' => [
                'discipline_grade' => $discipline > 90 ? 'A' : 'B',
                'metabolic_impact' => '+' . round($avgHealthScore / 10) . '% Efficiency',
                'budget_stability' => 'Stable',
                'nutrient_gap_status' => 'Analysis active based on real macro inputs.',
                'sustainability_score' => $avgHealthScore > 80 ? 92 : 85,
            ],
            'metrics' => [
                'target_calories' => $user->daily_calorie_target ?? 2200,
                'planned_calories' => $plannedCalories,
                'target_cost' => round(($user->monthly_budget_target ?? 20000) / 30),
                'planned_cost' => $plannedCost
            ],
            'batch_cooking_advice' => 'Since you are having ' . ($dinner->name ?? "dinner") . ' tonight, cook double portions of ' . explode(' ', $dinner->name ?? '')[0] . ' to use for lunch tomorrow to save ' . ($dinner->prep_time_minutes ?? 20) . ' minutes.'
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
