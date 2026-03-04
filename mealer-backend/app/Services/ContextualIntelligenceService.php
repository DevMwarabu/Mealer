<?php

namespace App\Services;

use App\Models\User;
use App\Models\Ingredient;
use Carbon\Carbon;

class ContextualIntelligenceService
{
    /**
     * Determine seasonal availability and pricing based on month and region.
     */
    public function getSeasonalContext($region = 'Kenya')
    {
        $month = now()->month;

        // Mock seasonal produce cycles for Kenya
        return match (true) {
            in_array($month, [3, 4, 5]) => ['season' => 'Long Rains', 'abundant' => ['Maize', 'Beans', 'Sukuma Wiki'], 'scarce' => ['Tomatoes']],
            in_array($month, [6, 7, 8]) => ['season' => 'Cool Dry', 'abundant' => ['Avocados', 'Citrus'], 'scarce' => ['Maize']],
            in_array($month, [10, 11, 12]) => ['season' => 'Short Rains', 'abundant' => ['Mangoes', 'Potatoes'], 'scarce' => ['Sukuma Wiki']],
            default => ['season' => 'Peak Harvest', 'abundant' => ['All Staples'], 'scarce' => []],
        };
    }

    /**
     * Map cultural and religious patterns (e.g., Ramadan, Lent).
     */
    public function getCulturalPatterns($userId, $region = 'Kenya')
    {
        // In a real app, this would check user settings/calendar
        return [
            'is_fasting_period' => false, // e.g. Ramadan detection
            'traditional_staples' => match ($region) {
                'Kenya' => ['Ugali', 'Sukuma Wiki', 'Nyama Choma', 'Githeri'],
                'Nigeria' => ['Jollof Rice', 'Pounded Yam', 'Egusi Soup'],
                default => ['Rice', 'Bread', 'Potatoes'],
            },
            'street_food_mapping' => match ($region) {
                'Kenya' => ['Smokie Pasua', 'Roasted Maize', 'Mutura'],
                default => [],
            }
        ];
    }

    /**
     * Recalibrate plan structure when a user moves regions.
     */
    public function adaptToNewRegion(User $user, $newRegion)
    {
        $oldRegion = $user->country;

        // Intelligence: How does macro distribution change?
        // e.g. Cold regions might need higher caloric density.
        $caloricAdj = match ($newRegion) {
            'UK', 'Canada' => 1.1, // +10% for thermogenesis
            'UAE', 'Egypt' => 0.95, // Lower for high heat
            default => 1.0,
        };

        return [
            'previous' => $oldRegion,
            'current' => $newRegion,
            'caloric_multiplier' => $caloricAdj,
            'suggested_cuisines' => $this->getCulturalPatterns($user->id, $newRegion)['traditional_staples'],
            'price_index_change' => match ($newRegion) {
                'USA', 'UK' => 4.5, // Significant cost increase vs Kenya
                'Uganda', 'Tanzania' => 0.85,
                default => 1.0,
            }
        ];
    }
}
