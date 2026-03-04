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
                ['name' => 'Chicken Breast', 'calories_per_unit' => 165, 'protein' => 31, 'carbs' => 0, 'fat' => 3.6, 'avg_price' => 800, 'anti_inflammatory_score' => 70, 'gut_health_score' => 50, 'nutrient_density_score' => 85, 'iron_content_mg' => 1.0, 'calcium_content_mg' => 15, 'potassium_content_mg' => 256],
                ['name' => 'Beef (Lean)', 'calories_per_unit' => 250, 'protein' => 26, 'carbs' => 0, 'fat' => 15, 'avg_price' => 600, 'anti_inflammatory_score' => 40, 'gut_health_score' => 40, 'nutrient_density_score' => 75, 'iron_content_mg' => 2.6, 'calcium_content_mg' => 18, 'potassium_content_mg' => 318],
                ['name' => 'Eggs', 'calories_per_unit' => 155, 'protein' => 13, 'carbs' => 1.1, 'fat' => 11, 'avg_price' => 20, 'anti_inflammatory_score' => 60, 'gut_health_score' => 60, 'nutrient_density_score' => 90, 'iron_content_mg' => 1.2, 'calcium_content_mg' => 50, 'potassium_content_mg' => 126],
                ['name' => 'Lentils (Cooked)', 'calories_per_unit' => 116, 'protein' => 9, 'carbs' => 20, 'fat' => 0.4, 'avg_price' => 150, 'anti_inflammatory_score' => 90, 'gut_health_score' => 95, 'nutrient_density_score' => 92, 'iron_content_mg' => 3.3, 'calcium_content_mg' => 19, 'potassium_content_mg' => 369],
            ],
            'Grains & Carbohydrates' => [
                ['name' => 'Rice (White, Cooked)', 'calories_per_unit' => 130, 'protein' => 2.7, 'carbs' => 28, 'fat' => 0.3, 'avg_price' => 140, 'anti_inflammatory_score' => 50, 'gut_health_score' => 40, 'nutrient_density_score' => 40, 'iron_content_mg' => 0.2, 'calcium_content_mg' => 10, 'potassium_content_mg' => 35],
                ['name' => 'Ugali (Maize Meal)', 'calories_per_unit' => 120, 'protein' => 2.5, 'carbs' => 26, 'fat' => 1.0, 'avg_price' => 110, 'anti_inflammatory_score' => 60, 'gut_health_score' => 70, 'nutrient_density_score' => 50, 'iron_content_mg' => 0.5, 'calcium_content_mg' => 5, 'potassium_content_mg' => 60],
                ['name' => 'Bread (Whole Wheat)', 'calories_per_unit' => 247, 'protein' => 13, 'carbs' => 41, 'fat' => 3.4, 'avg_price' => 65, 'anti_inflammatory_score' => 75, 'gut_health_score' => 85, 'nutrient_density_score' => 60, 'iron_content_mg' => 2.5, 'calcium_content_mg' => 100, 'potassium_content_mg' => 250],
                ['name' => 'Oats', 'calories_per_unit' => 389, 'protein' => 16.9, 'carbs' => 66, 'fat' => 6.9, 'avg_price' => 300, 'anti_inflammatory_score' => 85, 'gut_health_score' => 95, 'nutrient_density_score' => 80, 'iron_content_mg' => 4.7, 'calcium_content_mg' => 54, 'potassium_content_mg' => 429],
            ],
            'Vegetables' => [
                ['name' => 'Sukuma Wiki (Kale)', 'calories_per_unit' => 49, 'protein' => 4.3, 'carbs' => 8.8, 'fat' => 0.9, 'avg_price' => 30, 'anti_inflammatory_score' => 98, 'gut_health_score' => 90, 'nutrient_density_score' => 95, 'iron_content_mg' => 1.5, 'calcium_content_mg' => 150, 'potassium_content_mg' => 491],
                ['name' => 'Spinach', 'calories_per_unit' => 23, 'protein' => 2.9, 'carbs' => 3.6, 'fat' => 0.4, 'avg_price' => 40, 'anti_inflammatory_score' => 95, 'gut_health_score' => 85, 'nutrient_density_score' => 92, 'iron_content_mg' => 2.7, 'calcium_content_mg' => 99, 'potassium_content_mg' => 558],
                ['name' => 'Broccoli', 'calories_per_unit' => 34, 'protein' => 2.8, 'carbs' => 6.6, 'fat' => 0.4, 'avg_price' => 200, 'anti_inflammatory_score' => 94, 'gut_health_score' => 92, 'nutrient_density_score' => 90, 'iron_content_mg' => 0.7, 'calcium_content_mg' => 47, 'potassium_content_mg' => 316],
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
