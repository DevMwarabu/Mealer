<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\OptimizationEngineService;
use App\Models\MonthlyPlan;

class SimulationController extends Controller
{
    protected $optimizationService;

    public function __construct(OptimizationEngineService $optimizationService)
    {
        $this->optimizationService = $optimizationService;
    }

    /**
     * Run a simulation without persisting it.
     */
    public function run(Request $request)
    {
        $request->validate([
            'mode' => 'required|string|in:fiscal,protein,seasonal,baseline'
        ]);

        $user = $request->user();
        $result = $this->optimizationService->solveMonthlyOptimization($user, $request->mode);

        return response()->json($result);
    }

    /**
     * Apply a simulated plan to the user's active monthly plan.
     */
    public function apply(Request $request)
    {
        $request->validate([
            'mode' => 'required|string',
            'plan_data' => 'required|array'
        ]);

        $user = $request->user();

        // Update or create the monthly plan
        $plan = MonthlyPlan::updateOrCreate(
            ['user_id' => $user->id],
            [
                'strategy' => $request->mode,
                'plan_data' => $request->plan_data
            ]
        );

        return response()->json([
            'message' => 'Simulation successfully applied to your active plan.',
            'plan' => $plan
        ]);
    }

    /**
     * Get the active simulation mode.
     */
    public function active(Request $request)
    {
        $plan = MonthlyPlan::where('user_id', $request->user()->id)->first();

        return response()->json([
            'active_mode' => $plan ? $plan->strategy : 'baseline'
        ]);
    }
}
