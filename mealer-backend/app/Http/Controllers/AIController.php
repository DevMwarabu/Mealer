<?php

namespace App\Http\Controllers;

use App\Services\AIIntelligenceService;
use Illuminate\Http\Request;

class AIController extends Controller
{
    protected $aiService;

    public function __construct(AIIntelligenceService $aiService)
    {
        $this->aiService = $aiService;
    }

    public function estimateNutrition(Request $request)
    {
        $request->validate(['description' => 'required|string']);

        $user = $request->user();
        $country = $user->country ?? 'Kenya';

        $result = $this->aiService->estimateMealNutrition($request->description, $country);

        return response()->json($result);
    }

    public function planMonth(Request $request)
    {
        $user = $request->user();

        $constraints = [
            'budget' => $user->monthly_budget_target,
            'calories' => $user->daily_calorie_target,
            'country' => $user->country ?? 'Kenya',
            'restrictions' => $request->restrictions ?? [],
        ];

        $plan = $this->aiService->generateMonthlyPlan($constraints);

        return response()->json($plan);
    }
}
