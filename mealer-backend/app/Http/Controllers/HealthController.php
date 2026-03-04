<?php

namespace App\Http\Controllers;

use App\Services\NutritionIntelligenceService;
use App\Services\FinancialIntelligenceService;
use App\Models\BodyMetric;
use App\Models\WaterLog;
use Illuminate\Http\Request;
use Carbon\Carbon;

class HealthController extends Controller
{
    protected $nutritionService;
    protected $financialService;

    public function __construct(
        NutritionIntelligenceService $nutritionService,
        FinancialIntelligenceService $financialService
    ) {
        $this->nutritionService = $nutritionService;
        $this->financialService = $financialService;
    }

    public function getDailyScore(Request $request)
    {
        $user = $request->user();
        $date = $request->date ? Carbon::parse($request->date) : Carbon::today();

        $score = $this->nutritionService->calculateDailyScore($user, $date);
        $efficiency = $this->financialService->getBudgetEfficiency($user, $date);

        return response()->json([
            'date' => $date->toDateString(),
            'health_score' => $score,
            'budget_efficiency' => $efficiency,
            'status' => $score > 80 ? 'Optimal' : ($score > 60 ? 'Striving' : 'At Risk'),
        ]);
    }

    public function getBodyMetrics(Request $request)
    {
        $metrics = $request->user()->bodyMetrics()->latest()->take(10)->get();
        return response()->json($metrics);
    }

    public function logWater(Request $request)
    {
        $request->validate(['amount_ml' => 'required|integer|min:1']);

        $log = WaterLog::create([
            'user_id' => $request->user()->id,
            'amount_ml' => $request->amount_ml,
            'logged_at' => Carbon::now(),
        ]);

        return response()->json($log);
    }

    public function getDiversity(Request $request)
    {
        $user = $request->user();
        $score = $this->nutritionService->calculateDailyScore($user); // Diversity logic is inside
        return response()->json(['diversity_score' => $score]); // Simplified for MVP
    }

    public function getRisks(Request $request)
    {
        return response()->json($this->nutritionService->getRiskAssessment($request->user()));
    }

    public function getHabits(Request $request)
    {
        return response()->json($this->nutritionService->getHabitMetrics($request->user()));
    }
}
