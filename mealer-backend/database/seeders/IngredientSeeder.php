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
                ['name' => 'Omena', 'calories_per_unit' => 350, 'protein' => 62, 'carbs' => 0, 'fat' => 8, 'avg_price' => 300, 'anti_inflammatory_score' => 85, 'gut_health_score' => 70, 'nutrient_density_score' => 98, 'iron_content_mg' => 12.0, 'calcium_content_mg' => 200, 'potassium_content_mg' => 400],
                ['name' => 'Tilapia', 'calories_per_unit' => 96, 'protein' => 20, 'carbs' => 0, 'fat' => 1.7, 'avg_price' => 500, 'anti_inflammatory_score' => 80, 'gut_health_score' => 60, 'nutrient_density_score' => 88, 'iron_content_mg' => 0.6, 'calcium_content_mg' => 10, 'potassium_content_mg' => 302],
                ['name' => 'Ndengu (Green Grams)', 'calories_per_unit' => 347, 'protein' => 24, 'carbs' => 63, 'fat' => 1.2, 'avg_price' => 180, 'anti_inflammatory_score' => 88, 'gut_health_score' => 92, 'nutrient_density_score' => 85, 'iron_content_mg' => 6.7, 'calcium_content_mg' => 132, 'potassium_content_mg' => 1246],
            ],
            'Grains & Carbohydrates' => [
                ['name' => 'Rice (White)', 'calories_per_unit' => 130, 'protein' => 2.7, 'carbs' => 28, 'fat' => 0.3, 'avg_price' => 140, 'anti_inflammatory_score' => 50, 'gut_health_score' => 40, 'nutrient_density_score' => 40],
                ['name' => 'Maize Meal', 'calories_per_unit' => 365, 'protein' => 9, 'carbs' => 74, 'fat' => 4, 'avg_price' => 110, 'anti_inflammatory_score' => 60, 'gut_health_score' => 70, 'nutrient_density_score' => 50],
                ['name' => 'Wheat Flour', 'calories_per_unit' => 364, 'protein' => 10, 'carbs' => 76, 'fat' => 1, 'avg_price' => 170, 'anti_inflammatory_score' => 40, 'gut_health_score' => 30, 'nutrient_density_score' => 45],
                ['name' => 'Sweet Potato', 'calories_per_unit' => 86, 'protein' => 1.6, 'carbs' => 20, 'fat' => 0.1, 'avg_price' => 100, 'anti_inflammatory_score' => 92, 'gut_health_score' => 94, 'nutrient_density_score' => 88],
                ['name' => 'Arrowroot (Nduma)', 'calories_per_unit' => 65, 'protein' => 0.1, 'carbs' => 13, 'fat' => 0.1, 'avg_price' => 250, 'anti_inflammatory_score' => 85, 'gut_health_score' => 90, 'nutrient_density_score' => 70],
                ['name' => 'Cassava', 'calories_per_unit' => 160, 'protein' => 1.4, 'carbs' => 38, 'fat' => 0.3, 'avg_price' => 80, 'anti_inflammatory_score' => 70, 'gut_health_score' => 65, 'nutrient_density_score' => 55],
            ],
            'Vegetables' => [
                ['name' => 'Sukuma Wiki', 'calories_per_unit' => 49, 'protein' => 4.3, 'carbs' => 8.8, 'fat' => 0.9, 'avg_price' => 30, 'anti_inflammatory_score' => 98, 'gut_health_score' => 90, 'nutrient_density_score' => 95],
                ['name' => 'Spinach', 'calories_per_unit' => 23, 'protein' => 2.9, 'carbs' => 3.6, 'fat' => 0.4, 'avg_price' => 40, 'anti_inflammatory_score' => 95, 'gut_health_score' => 85, 'nutrient_density_score' => 92],
                ['name' => 'Cabbage', 'calories_per_unit' => 25, 'protein' => 1.3, 'carbs' => 5.8, 'fat' => 0.1, 'avg_price' => 50, 'anti_inflammatory_score' => 80, 'gut_health_score' => 88, 'nutrient_density_score' => 75],
                ['name' => 'Managu', 'calories_per_unit' => 35, 'protein' => 4.5, 'carbs' => 6, 'fat' => 0.5, 'avg_price' => 60, 'anti_inflammatory_score' => 99, 'gut_health_score' => 95, 'nutrient_density_score' => 97],
                ['name' => 'Saget', 'calories_per_unit' => 38, 'protein' => 4.2, 'carbs' => 6.5, 'fat' => 0.6, 'avg_price' => 70, 'anti_inflammatory_score' => 97, 'gut_health_score' => 93, 'nutrient_density_score' => 96],
            ],
            'Fruits & Healthy Fats' => [
                ['name' => 'Avocado', 'calories_per_unit' => 160, 'protein' => 2, 'carbs' => 9, 'fat' => 15, 'avg_price' => 40, 'anti_inflammatory_score' => 95, 'gut_health_score' => 90, 'nutrient_density_score' => 90],
                ['name' => 'Banana', 'calories_per_unit' => 89, 'protein' => 1.1, 'carbs' => 23, 'fat' => 0.3, 'avg_price' => 10, 'anti_inflammatory_score' => 70, 'gut_health_score' => 85, 'nutrient_density_score' => 75],
                ['name' => 'Mango', 'calories_per_unit' => 60, 'protein' => 0.8, 'carbs' => 15, 'fat' => 0.4, 'avg_price' => 30, 'anti_inflammatory_score' => 85, 'gut_health_score' => 80, 'nutrient_density_score' => 82],
            ],
        ];

        foreach ($categories as $catName => $items) {
            $category = IngredientCategory::firstOrCreate(['name' => $catName]);
            foreach ($items as $item) {
                $category->ingredients()->updateOrCreate(['name' => $item['name']], $item);
            }
        }
    }
}
