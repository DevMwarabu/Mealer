<?php

namespace App\Services;

use App\Models\User;
use App\Models\Ingredient;

class TasteIntelligenceService
{
    /**
     * Record a "Swap" or "Consumption" to update the taste matrix.
     */
    public function recordPreference(User $user, $ingredientId, $action = 'consume')
    {
        $prefs = $user->taste_preferences ?? [];
        $weight = $action === 'consume' ? 1.1 : 0.8; // Swapping away reduces weight

        $prefs[$ingredientId] = ($prefs[$ingredientId] ?? 1.0) * $weight;

        // Normalize
        asort($prefs);
        $user->taste_preferences = array_slice($prefs, -50, null, true); // Keep top 50
        $user->save();
    }

    /**
     * Get the preference weight for an ingredient.
     */
    public function getPreferenceWeight($user, $ingredientId)
    {
        return $user->taste_preferences[$ingredientId] ?? 1.0;
    }
}
