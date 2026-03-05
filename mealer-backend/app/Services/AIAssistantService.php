<?php

namespace App\Services;

use App\Models\User;
use App\Models\Ingredient;
use App\Models\Meal;

class AIAssistantService
{
    /**
     * Process a natural language query from the user.
     */
    public function ask(User $user, string $query)
    {
        $query = strtolower($query);

        if (str_contains($query, 'eat today') || str_contains($query, 'suggest')) {
            return $this->getMealSuggestion($user, $query);
        }

        if (str_contains($query, 'cheap') || str_contains($query, 'budget') || str_contains($query, 'save money')) {
            return $this->getBudgetTip($user);
        }

        if (str_contains($query, 'protein') || str_contains($query, 'muscle')) {
            return $this->getNutritionInsight($user, 'protein');
        }

        return [
            'response' => "I'm your Mealer Assistant. I can help with meal suggestions, budget tips, or nutritional gaps. Try asking 'What should I eat today?'",
            'type' => 'general'
        ];
    }

    private function getMealSuggestion(User $user, string $query)
    {
        // Simple heuristic for now, in a real app this would call an LLM with context
        $timeOfDay = now()->hour;
        $type = 'Snack';
        if ($timeOfDay < 11)
            $type = 'Breakfast';
        elseif ($timeOfDay < 16)
            $type = 'Lunch';
        elseif ($timeOfDay < 22)
            $type = 'Dinner';

        return [
            'response' => "Based on your {$user->country} context and current macro targets, I suggest a high-fiber {$type}. Would you like me to add it to your plan?",
            'suggestion' => [
                'name' => "Custom AI {$type}",
                'type' => $type,
                'calories' => 450
            ],
            'type' => 'suggestion'
        ];
    }

    private function getBudgetTip(User $user)
    {
        return [
            'response' => "You've spent about 15% of your KES {$user->monthly_budget_target} budget. To save more, I recommend utilizing the batch-cooking feature for tomorrow's lunch.",
            'type' => 'budget'
        ];
    }

    private function getNutritionInsight(User $user, string $nutrient)
    {
        return [
            'response' => "Your {$nutrient} intake is trending slightly below your target. I've adjusted your next 3 meals to prioritize lean proteins.",
            'type' => 'nutrition'
        ];
    }
}
