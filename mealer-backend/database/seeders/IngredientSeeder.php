<?php

namespace Database\Seeders;

use App\Models\Ingredient;
use App\Models\IngredientCategory;
use Illuminate\Database\Seeder;

class IngredientSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Proteins' => [
                ['name' => 'Chicken Breast', 'calories_per_unit' => 165, 'protein' => 31, 'carbs' => 0, 'fat' => 3.6, 'avg_price' => 800],
                ['name' => 'Beef (Lean)', 'calories_per_unit' => 250, 'protein' => 26, 'carbs' => 0, 'fat' => 15, 'avg_price' => 600],
                ['name' => 'Eggs', 'calories_per_unit' => 155, 'protein' => 13, 'carbs' => 1.1, 'fat' => 11, 'avg_price' => 20],
                ['name' => 'Lentils (Cooked)', 'calories_per_unit' => 116, 'protein' => 9, 'carbs' => 20, 'fat' => 0.4, 'avg_price' => 150],
            ],
            'Grains & Carbohydrates' => [
                ['name' => 'Rice (White, Cooked)', 'calories_per_unit' => 130, 'protein' => 2.7, 'carbs' => 28, 'fat' => 0.3, 'avg_price' => 140],
                ['name' => 'Ugali (Maize Meal)', 'calories_per_unit' => 120, 'protein' => 2.5, 'carbs' => 26, 'fat' => 1.0, 'avg_price' => 110],
                ['name' => 'Bread (Whole Wheat)', 'calories_per_unit' => 247, 'protein' => 13, 'carbs' => 41, 'fat' => 3.4, 'avg_price' => 65],
                ['name' => 'Oats', 'calories_per_unit' => 389, 'protein' => 16.9, 'carbs' => 66, 'fat' => 6.9, 'avg_price' => 300],
            ],
            'Vegetables' => [
                ['name' => 'Sukuma Wiki (Kale)', 'calories_per_unit' => 49, 'protein' => 4.3, 'carbs' => 8.8, 'fat' => 0.9, 'avg_price' => 30],
                ['name' => 'Spinach', 'calories_per_unit' => 23, 'protein' => 2.9, 'carbs' => 3.6, 'fat' => 0.4, 'avg_price' => 40],
                ['name' => 'Broccoli', 'calories_per_unit' => 34, 'protein' => 2.8, 'carbs' => 6.6, 'fat' => 0.4, 'avg_price' => 200],
            ],
        ];

        foreach ($categories as $catName => $items) {
            $category = IngredientCategory::create(['name' => $catName]);
            foreach ($items as $item) {
                $category->ingredients()->create($item);
            }
        }
    }
}
