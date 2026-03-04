<?php

namespace App\Services;

use App\Models\User;
use App\Models\Meal;
use Carbon\Carbon;

class NutritionIntelligenceService
{
    /**
     * Calculate a daily health score for a user.
     * health_score = nutrition_balance (40%) + budget_efficiency (20%) + diversity_index (20%) + consistency_score (20%)
     */
    public function calculateDailyScore(User $user, $date = null)
    {
        $date = $date ?: Carbon::today();

        $nutritionBalance = $this->getNutritionBalance($user, $date); // 0-100
        $budgetEfficiency = $this->getBudgetEfficiency($user, $date); // 0-100
        $diversityIndex = $this->getDiversityIndex($user, $date);     // 0-100
        $consistencyScore = $this->getConsistencyScore($user, $date); // 0-100

        $score = ($nutritionBalance * 0.4) +
            ($budgetEfficiency * 0.2) +
            ($diversityIndex * 0.2) +
            ($consistencyScore * 0.2);

        return round($score);
    }

    protected function getNutritionBalance(User $user, $date)
    {
        $meals = $user->meals()->whereDate('consumed_at', $date)->get();
        if ($meals->isEmpty())
            return 0;

        $targetCalories = $user->daily_calorie_target ?: 2000;
        $actualCalories = $meals->sum('total_calories');

        // Simple accuracy score: 100 - abs(% deviation)
        $deviation = abs(($actualCalories - $targetCalories) / $targetCalories) * 100;
        return max(0, 100 - $deviation);
    }

    protected function getBudgetEfficiency(User $user, $date)
    {
        // To be implemented by FinancialIntelligenceService
        return 85;
    }

    protected function getDiversityIndex(User $user, $date)
    {
        // Calculation based on distinct ingredients used in the last 7 days
        $start = Carbon::parse($date)->subDays(7);
        $ingredientsCount = \DB::table('meal_items')
            ->join('meals', 'meal_items.meal_id', '=', 'meals.id')
            ->where('meals.user_id', $user->id)
            ->whereBetween('meals.consumed_at', [$start, $date])
            ->distinct('ingredient_id')
            ->count();

        // Target: 20+ distinct ingredients per week for perfect score
        return min(100, ($ingredientsCount / 20) * 100);
    }

    protected function getConsistencyScore(User $user, $date)
    {
        // Check if user has logged 3+ meals today
        $mealsCount = $user->meals()->whereDate('consumed_at', $date)->count();
        return min(100, ($mealsCount / 3) * 100);
    }

    /**
     * Analyze metabolic risks based on recent logs.
     */
    public function getRiskAssessment(User $user)
    {
        $last7Days = $user->meals()->where('consumed_at', '>=', Carbon::now()->subDays(7))->get();
        if ($last7Days->isEmpty())
            return [];

        $risks = [];

        // Sodium Check (Target < 2300mg/day)
        $avgSodium = $last7Days->avg('total_sodium');
        if ($avgSodium > 2300) {
            $risks[] = [
                'type' => 'Sodium',
                'level' => $avgSodium > 3500 ? 'High' : 'Medium',
                'message' => 'Average sodium intake is exceeding recommended limits.',
                'value' => round($avgSodium) . 'mg',
            ];
        }

        // Sugar Check (Target < 50g/day)
        $avgSugar = $last7Days->avg('total_sugar');
        if ($avgSugar > 50) {
            $risks[] = [
                'type' => 'Sugar',
                'level' => $avgSugar > 80 ? 'High' : 'Medium',
                'message' => 'High refined sugar detected in recent meal cycles.',
                'value' => round($avgSugar) . 'g',
            ];
        }

        // Diversity Check
        $diversity = $this->getDiversityIndex($user, Carbon::now());
        if ($diversity < 40) {
            $risks[] = [
                'type' => 'Diversity',
                'level' => 'Critital',
                'message' => 'Food variety is significantly below metabolic diversity targets.',
                'value' => round($diversity) . '%',
            ];
        }

        return $risks;
    }

    /**
     * Calculate longitudinal habit and consistency markers.
     */
    public function getHabitMetrics(User $user)
    {
        $last30Days = $user->meals()
            ->where('consumed_at', '>=', Carbon::now()->subDays(30))
            ->orderBy('consumed_at', 'asc')
            ->get();

        if ($last30Days->isEmpty())
            return ['streak' => 0, 'consistency' => 0];

        // 1. Logging Streak
        $streak = 0;
        $currentDate = Carbon::yesterday();
        while (true) {
            $hasLogs = $user->meals()->whereDate('consumed_at', $currentDate)->exists();
            if (!$hasLogs)
                break;
            $streak++;
            $currentDate->subDay();
        }

        // 2. Meal Timing Consistency (Std Dev of meal times)
        $mealTimesBySlot = [
            'Breakfast' => [],
            'Lunch' => [],
            'Dinner' => []
        ];

        foreach ($last30Days as $meal) {
            if (isset($mealTimesBySlot[$meal->meal_type])) {
                $mealTimesBySlot[$meal->meal_type][] = Carbon::parse($meal->consumed_at)->hour;
            }
        }

        $variance = 0;
        foreach ($mealTimesBySlot as $slot => $hours) {
            if (count($hours) > 1) {
                $avg = array_sum($hours) / count($hours);
                $sumSq = 0;
                foreach ($hours as $h) {
                    $sumSq += ($h - $avg) ** 2;
                }
                $variance += $sumSq / count($hours);
            }
        }

        $consistencyScore = max(0, 100 - ($variance * 5));

        return [
            'streak' => $streak,
            'consistency_index' => round($consistencyScore),
            'status' => $consistencyScore > 80 ? 'Master' : ($consistencyScore > 50 ? 'Steady' : 'Emerging'),
            'momentum' => $streak > 3 ? 'Rising' : 'Neutral',
        ];
    }
}
