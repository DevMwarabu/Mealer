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

    /**
     * Today's specific plan overview.
     */
    public function getToday(Request $request)
    {
        $user = new \App\Models\User([
            'id' => 1,
            'country' => 'Kenya',
            'monthly_budget_target' => 20000,
            'name' => 'Demo User'
        ]);

        $seasonal = $this->contextualService->getSeasonalContext($user->country);
        $cultural = $this->contextualService->getCulturalPatterns($user->id, $user->country);
        $behavioral = $this->behavioralService->getCognitiveLoadStatus($user);
        $discipline = $this->behavioralService->calculateDisciplineScore($user);
        $predictions = $this->predictiveService->predictWeightTrajectory($user);
        $clinical = $this->predictiveService->generateClinicalSummary($user);

        // Mock Household Coordination
        $householdStats = [
            'sync_active' => true,
            'collective_remaining' => 4500,
            'family_portions' => 4,
            'shared_grocery_alert' => 'User "Sarah" has picked up the milk.'
        ];

        // Simulating an inflation alert for one of the ingredients
        $sampleIngredient = new \App\Models\Ingredient(['name' => 'Beef (Lean)', 'category_id' => 1]); // Category 1 = Proteins
        $alternative = $this->financialService->suggestAlternatives($sampleIngredient);

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
                'inflation_alert' => $alternative ? "High inflation on {$sampleIngredient->name}. Suggested alternative: {$alternative['item']} ({$alternative['savings']} savings)." : null,
                'behavioral_load' => $behavioral['status'],
                'discipline_score' => $discipline
            ],
            'meals' => [
                ['id' => 'm1', 'type' => 'Breakfast', 'name' => 'Metabolic-Boost Oats', 'calories' => 420, 'cost' => 'KES 180', 'metabolic_score' => 92, 'status' => 'pending'],
                ['id' => 'm2', 'type' => 'Lunch', 'name' => 'Anti-Inflammatory Salmon', 'calories' => 550, 'cost' => 'KES 850', 'metabolic_score' => 98, 'status' => 'pending'],
                ['id' => 'm3', 'type' => 'Dinner', 'name' => 'Gut-Health Fiber Bowl', 'calories' => 600, 'cost' => 'KES 220', 'metabolic_score' => 95, 'status' => 'pending'],
            ],
            'v2_metrics' => [
                'discipline_grade' => 'A',
                'metabolic_impact' => '+12% Efficiency',
                'budget_stability' => 'Stable',
                'nutrient_gap_status' => 'Iron: Optimal, Potassium: Low (+200mg required)',
                'sustainability_score' => 88
            ],
            'metrics' => [
                'target_calories' => 1950,
                'planned_calories' => 1570,
                'target_cost' => 1250,
                'planned_cost' => 1250
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
