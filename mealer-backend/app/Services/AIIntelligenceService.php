<?php

namespace App\Services;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class AIIntelligenceService
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

    /**
     * Estimate macros and cost for a custom meal description.
     */
    public function estimateMealNutrition(string $description, ?string $country = 'Kenya')
    {
        // In production, this would use OpenAI/Gemini to extract ingredients and quantities
        // and cross-reference with our 'ingredients' table or an external API.

        Log::info("AI Processing: {$description} in {$country}");

        // Placeholder for advanced AI extraction
        return [
            'calories' => 450,
            'protein' => 25,
            'carbs' => 60,
            'fat' => 12,
            'fiber' => 8,
            'sodium' => 400,
            'sugar' => 5,
            'estimated_cost' => 150.00,
            'currency' => $country === 'Kenya' ? 'KES' : 'USD',
            'glycemic_impact' => 'Medium',
            'is_processed' => false,
            'suggestions' => ['Add more leafy greens', 'Reduce salt'],
            'items' => [
                ['name' => 'Eggs', 'quantity' => 100, 'unit' => 'g', 'calories' => 155, 'protein' => 13, 'cost' => 40],
                ['name' => 'Spinach', 'quantity' => 50, 'unit' => 'g', 'calories' => 12, 'protein' => 1.5, 'cost' => 10],
                ['name' => 'Whole Wheat Toast', 'quantity' => 40, 'unit' => 'g', 'calories' => 100, 'protein' => 4, 'cost' => 30],
            ],
        ];
    }

    /**
     * Generate a 30-day nutrition and financial roadmap.
     */
    public function generateMonthlyPlan(User $user)
    {
        $budget = $user->monthly_budget_target ?: 20000;
        $country = $user->country ?: 'Kenya';

        $plan = [];
        $costMultiplier = $country === 'Kenya' ? 1.0 : 0.8; // Example regional adjustment

        for ($day = 1; $day <= 30; $day++) {
            $isWeekend = ($day % 7 === 6 || $day % 7 === 0);

            // Advanced Logic Sim: Weekday (Fast, Prep-heavy) vs Weekend (Slow, Elaborate)
            $breakfast = $isWeekend ? 'Pancakes & Scrambled Eggs' : 'Oatmeal & Bananas';
            $lunch = $isWeekend ? 'Grilled Fish & Veggies' : 'Chicken Pasta Prep';
            $dinner = $isWeekend ? 'Family-style Roast' : 'Quick Bean Stew';

            $plan[] = [
                'day' => $day,
                'date' => Carbon::now()->addDays($day)->toDateString(),
                'is_weekend' => $isWeekend,
                'meals' => [
                    ['type' => 'Breakfast', 'name' => $breakfast, 'cost' => 150 * $costMultiplier, 'calories' => $isWeekend ? 500 : 350],
                    ['type' => 'Lunch', 'name' => $lunch, 'cost' => 450 * $costMultiplier, 'calories' => 500],
                    ['type' => 'Dinner', 'name' => $dinner, 'cost' => 600 * $costMultiplier, 'calories' => $isWeekend ? 850 : 600],
                ],
                'daily_cost' => 1200 * $costMultiplier,
                'daily_calories' => $isWeekend ? 1850 : 1450,
            ];
        }

        return [
            'plan_id' => uniqid('plan_'),
            'duration' => '30 Days',
            'total_estimated_cost' => 36000,
            'budget_status' => 36000 > $budget ? 'Over Budget' : 'Within Budget',
            'savings_potential' => 4500,
            'advanced_metrics' => [
                'macro_balance_score' => 92,
                'ingredient_reuse_score' => 'High (Optimal Waste Reduction)',
                'cultural_variety_index' => 'Balanced (4 Regions)',
                'prep_time_efficiency' => 'Maximized for Weekdays'
            ],
            'weekly_grocery_list' => [
                ['item' => 'Rice (Local)', 'qty' => '5kg', 'estimated_price' => 700],
                ['item' => 'Lentils', 'qty' => '2kg', 'estimated_price' => 360],
                ['item' => 'Chicken Breast', 'qty' => '3kg', 'estimated_price' => 2400],
            ],
            'days' => $plan
        ];
    }
}
