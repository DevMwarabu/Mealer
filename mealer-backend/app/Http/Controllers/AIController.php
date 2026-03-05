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
        $strategy = $request->input('strategy', 'Optimal');
        $user = $request->user();

        $constraints = [
            'strategy' => $strategy,
            'budget' => 15000, // Default for demo, should come from profile
            'country' => 'Kenya'
        ];

        $plan = $this->aiService->generateMonthlyPlan($constraints);

        if ($user) {
            \App\Models\MonthlyPlan::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'strategy' => $strategy,
                    'plan_data' => $plan
                ]
            );
        }

        return response()->json($plan);
    }

    public function getLatestPlan(Request $request)
    {
        $user = $request->user();
        if (!$user)
            return response()->json(null);

        $plan = \App\Models\MonthlyPlan::where('user_id', $user->id)->latest()->first();
        return response()->json($plan ? $plan->plan_data : null);
    }

    public function savePlan(Request $request)
    {
        $user = $request->user();
        if (!$user)
            return response()->json(['error' => 'Unauthorized'], 401);

        \App\Models\MonthlyPlan::updateOrCreate(
            ['user_id' => $user->id],
            [
                'strategy' => $request->strategy ?? 'Custom',
                'plan_data' => $request->plan_data
            ]
        );

        return response()->json(['message' => 'Plan saved successfully']);
    }

    public function voiceLog(Request $request)
    {
        // Simulates audio transcription + extraction
        $result = $this->aiService->estimateMealNutrition("Voice Transcription: I had a large bowl of lentil soup with two slices of rye bread.", $request->user()?->country);
        return response()->json($result);
    }

    public function photoScan(Request $request)
    {
        // Simulates computer vision analysis
        $result = $this->aiService->estimateMealNutrition("Vision Analysis: Detected Grilled Salmon with Steamed Broccoli and Quinoa.", $request->user()?->country);
        return response()->json($result);
    }

    public function barcodeScan(Request $request)
    {
        // Simulates UPC lookup
        $result = $this->aiService->estimateMealNutrition("Barcode Lookup: UP-7781023 (Organic Almond Milk - Unsweetened)", $request->user()?->country);
        return response()->json($result);
    }
}
