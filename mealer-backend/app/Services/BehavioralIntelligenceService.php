<?php

namespace App\Services;

use App\Models\User;
use App\Models\Meal;

class BehavioralIntelligenceService
{
    /**
     * Calculate a discipline score based on plan adherence.
     */
    public function calculateDisciplineScore(User $user)
    {
        // Mock logic: Compare logged meals vs planned meals
        // In a real app, this would query the DB for consistency
        return 92.5; // High discipline
    }

    /**
     * Detect "Cognitive Load" and suggest familiar meals.
     */
    public function getCognitiveLoadStatus(User $user)
    {
        $hour = now()->hour;
        $isBusyDay = now()->isWeekday();

        if ($hour > 18 && $isBusyDay) {
            return [
                'status' => 'High Load Detected',
                'recommendation' => 'Auto-select "Familiar Comfort" meal to reduce decision fatigue.'
            ];
        }

        return ['status' => 'Normal', 'recommendation' => null];
    }

    /**
     * Eating Pattern Detection (e.g. Carb Spikes).
     */
    public function detectPatterns(User $user)
    {
        return [
            ['type' => 'Positive', 'message' => 'Consistency in protein intake is up 15%.'],
            ['type' => 'Warning', 'message' => 'Carb-spike pattern detected after 8 PM. Suggesting lighter dinner.'],
        ];
    }
}
