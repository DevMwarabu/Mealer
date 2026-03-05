<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Household;
use App\Models\Ingredient;
use App\Models\Meal;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class V2IntelligenceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create a demo Household
        $household = Household::create([
            'name' => 'Mealer HQ',
            'collective_monthly_budget' => 50000,
        ]);

        // 2. Create the V2 Admin User
        $user = User::create([
            'name' => 'Mealer Admin',
            'email' => 'admin@mealer.com',
            'password' => 'password', // Will be hashed by model cast
            'country' => 'Kenya',
            'daily_calorie_target' => 2200,
            'monthly_budget_target' => 20000,
            'household_id' => $household->id,
            'discipline_score' => 98.5,
        ]);

        // 0. Create Ingredient Categories
        $categories = [
            ['id' => 1, 'name' => 'Vegetables'],
            ['id' => 2, 'name' => 'Grains'],
            ['id' => 3, 'name' => 'Proteins'],
            ['id' => 4, 'name' => 'Fruits'],
            ['id' => 5, 'name' => 'Dairy'],
        ];
        foreach ($categories as $cat) {
            \App\Models\IngredientCategory::create($cat);
        }

        // 3. Create V2 Sample Ingredients with Metabolic Metadata
        $ingredients = [
            [
                'name' => 'Organic Spinach',
                'category_id' => 1, // Vegetables
                'calories_per_unit' => 23,
                'protein' => 2.9,
                'fat' => 0.4,
                'carbs' => 3.6,
                'avg_price' => 150,
                'anti_inflammatory_score' => 95,
                'gut_health_score' => 92,
                'glycemic_impact' => 15,
                'is_seasonal' => true,
                'historical_avg_price' => 140,
            ],
            [
                'name' => 'Salmon Fillet',
                'category_id' => 3, // Proteins
                'calories_per_unit' => 208,
                'protein' => 20,
                'fat' => 13,
                'carbs' => 0,
                'avg_price' => 1200,
                'anti_inflammatory_score' => 98,
                'gut_health_score' => 85,
                'glycemic_impact' => 0,
                'is_seasonal' => false,
                'historical_avg_price' => 1100,
            ],
        ];

        foreach ($ingredients as $ing) {
            Ingredient::create($ing);
        }

        // 4. Create Sample Meals
        Meal::create([
            'user_id' => $user->id,
            'meal_type' => 'Breakfast',
            'total_calories' => 450,
            'total_protein' => 25,
            'total_fat' => 15,
            'total_carbs' => 40,
            'health_score_snapshot' => 94,
            'total_cost' => 350,
            'consumed_at' => now(),
        ]);
    }
}
