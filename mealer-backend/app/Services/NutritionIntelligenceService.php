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
     * Get macro distribution for the last 30 days.
     */
    public function getMacroDistribution(User $user)
    {
        $last30Days = $user->meals()
            ->where('consumed_at', '>=', Carbon::now()->subDays(30))
            ->get();

        if ($last30Days->isEmpty()) {
            return [
                ['name' => 'Protein', 'value' => 33, 'color' => '#1F7A5C'],
                ['name' => 'Carbs', 'value' => 33, 'color' => '#3AAFA9'],
                ['name' => 'Fats', 'value' => 34, 'color' => '#F4A261'],
            ];
        }

        $totalProtein = $last30Days->sum('total_protein');
        $totalCarbs = $last30Days->sum('total_carbs');
        $totalFats = $last30Days->sum('total_fats');
        $grandTotal = $totalProtein + $totalCarbs + $totalFats;

        if ($grandTotal === 0)
            return $this->getMacroDistribution($user); // Fallback to neutral

        return [
            ['name' => 'Protein', 'value' => round(($totalProtein / $grandTotal) * 100), 'color' => '#1F7A5C'],
            ['name' => 'Carbs', 'value' => round(($totalCarbs / $grandTotal) * 100), 'color' => '#3AAFA9'],
            ['name' => 'Fats', 'value' => round(($totalFats / $grandTotal) * 100), 'color' => '#F4A261'],
        ];
    }

    /**
     * Get 4-week health score trend.
     */
    public function getWeeklyTrend(User $user)
    {
        $trends = [];
        for ($i = 3; $i >= 0; $i--) {
            $start = Carbon::now()->subWeeks($i + 1)->startOfWeek();
            $end = Carbon::now()->subWeeks($i + 1)->endOfWeek();

            // Average daily score for that week
            $scores = [];
            for ($d = clone $start; $d <= $end; $d->addDay()) {
                $scores[] = $this->calculateDailyScore($user, $d);
            }

            $trends[] = [
                'date' => 'W' . (4 - $i),
                'score' => round(array_sum($scores) / count($scores)),
                'avg' => 65 // Population baseline
            ];
        }

        return $trends;
    }

    /**
     * Calculate longitudinal habit and consistency markers.
     */
    public function getHabitMetrics(User $user)
    {
        // ... (existing logic remains same)
        $last30Days = $user->meals()
            ->where('consumed_at', '>=', Carbon::now()->subDays(30))
            ->orderBy('consumed_at', 'asc')
            ->get();

        if ($last30Days->isEmpty())
            return ['streak' => 0, 'consistency_index' => 0, 'status' => 'New', 'momentum' => 'Neutral'];

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

        // 2. Consistency
        $daysWithLogs = $user->meals()
            ->where('consumed_at', '>=', Carbon::now()->subDays(30))
            ->distinct()
            ->count(\DB::raw('DATE(consumed_at)'));

        $consistencyScore = ($daysWithLogs / 30) * 100;

        return [
            'streak' => $streak,
            'consistency_index' => round($consistencyScore),
            'status' => $consistencyScore > 80 ? 'Master' : ($consistencyScore > 50 ? 'Steady' : 'Emerging'),
            'momentum' => $streak > 3 ? 'Rising' : ($streak > 0 ? 'Stable' : 'Stalling'),
        ];
    }
}
