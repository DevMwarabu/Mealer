<?php

namespace App\Console\Commands;

use App\Models\Recipe;
use Illuminate\Console\Command;

class GenerateKenyanMeals extends Command
{
    protected $signature = 'meals:generate {count=5000}';
    protected $description = 'Auto-generate thousands of realistic Kenyan meals using combinatorial ingredients.';

    private $carbs = [
        ['name' => 'Ugali', 'cal' => 220, 'pro' => 4, 'fat' => 1, 'carb' => 47, 'cost' => 30, 'prep' => 20, 'tags' => ['traditional', 'cheap_meal']],
        ['name' => 'Rice', 'cal' => 205, 'pro' => 4, 'fat' => 0, 'carb' => 45, 'cost' => 50, 'prep' => 25, 'tags' => ['quick_meal']],
        ['name' => 'Chapati', 'cal' => 300, 'pro' => 7, 'fat' => 10, 'carb' => 45, 'cost' => 40, 'prep' => 35, 'tags' => ['traditional']],
        ['name' => 'Sweet Potatoes', 'cal' => 114, 'pro' => 2, 'fat' => 0, 'carb' => 26, 'cost' => 45, 'prep' => 30, 'tags' => ['healthy', 'traditional']],
        ['name' => 'Arrowroots', 'cal' => 140, 'pro' => 1, 'fat' => 0, 'carb' => 32, 'cost' => 60, 'prep' => 35, 'tags' => ['healthy', 'traditional']],
        ['name' => 'Matoke', 'cal' => 120, 'pro' => 1, 'fat' => 0, 'carb' => 30, 'cost' => 50, 'prep' => 25, 'tags' => ['traditional']],
        ['name' => 'Spaghetti', 'cal' => 220, 'pro' => 8, 'fat' => 1, 'carb' => 43, 'cost' => 40, 'prep' => 15, 'tags' => ['quick_meal']],
        ['name' => 'Pilau', 'cal' => 350, 'pro' => 8, 'fat' => 12, 'carb' => 48, 'cost' => 80, 'prep' => 50, 'tags' => ['traditional', 'weekend_meal']],
        ['name' => 'Coconut Rice', 'cal' => 280, 'pro' => 5, 'fat' => 12, 'carb' => 46, 'cost' => 70, 'prep' => 35, 'tags' => ['coastal']],
        ['name' => 'Githeri', 'cal' => 320, 'pro' => 14, 'fat' => 2, 'carb' => 60, 'cost' => 50, 'prep' => 60, 'tags' => ['traditional', 'healthy', 'cheap_meal']],
    ];

    private $proteins = [
        ['name' => 'Beef Stew', 'cal' => 350, 'pro' => 30, 'fat' => 20, 'carb' => 8, 'cost' => 150, 'prep' => 45, 'tags' => ['high_protein'], 'type' => 'meat'],
        ['name' => 'Chicken Curry', 'cal' => 320, 'pro' => 28, 'fat' => 15, 'carb' => 12, 'cost' => 180, 'prep' => 50, 'tags' => ['high_protein'], 'type' => 'meat'],
        ['name' => 'Tilapia Fish', 'cal' => 260, 'pro' => 35, 'fat' => 12, 'carb' => 2, 'cost' => 200, 'prep' => 30, 'tags' => ['health', 'high_protein'], 'type' => 'meat'],
        ['name' => 'Omena', 'cal' => 280, 'pro' => 30, 'fat' => 14, 'carb' => 5, 'cost' => 80, 'prep' => 25, 'tags' => ['cheap_meal', 'high_protein'], 'type' => 'meat'],
        ['name' => 'Beans', 'cal' => 220, 'pro' => 15, 'fat' => 1, 'carb' => 40, 'cost' => 40, 'prep' => 40, 'tags' => ['vegetarian', 'cheap_meal', 'healthy'], 'type' => 'plant'],
        ['name' => 'Lentils', 'cal' => 230, 'pro' => 18, 'fat' => 1, 'carb' => 40, 'cost' => 50, 'prep' => 35, 'tags' => ['vegetarian', 'healthy'], 'type' => 'plant'],
        ['name' => 'Ndengu (Green Grams)', 'cal' => 210, 'pro' => 16, 'fat' => 1, 'carb' => 38, 'cost' => 60, 'prep' => 35, 'tags' => ['vegetarian', 'healthy'], 'type' => 'plant'],
        ['name' => 'Goat Meat Fry', 'cal' => 400, 'pro' => 32, 'fat' => 25, 'carb' => 5, 'cost' => 220, 'prep' => 50, 'tags' => ['high_protein', 'premium'], 'type' => 'meat'],
        ['name' => 'Fried Eggs', 'cal' => 180, 'pro' => 14, 'fat' => 14, 'carb' => 2, 'cost' => 50, 'prep' => 10, 'tags' => ['quick_meal', 'breakfast'], 'type' => 'egg'],
        ['name' => 'Matumbo', 'cal' => 250, 'pro' => 25, 'fat' => 15, 'carb' => 2, 'cost' => 90, 'prep' => 45, 'tags' => ['traditional', 'cheap_meal'], 'type' => 'meat'],
    ];

    private $veggies = [
        ['name' => 'Sukuma Wiki', 'cal' => 50, 'pro' => 3, 'fat' => 2, 'carb' => 8, 'cost' => 20, 'prep' => 15, 'tags' => ['vegetarian', 'healthy']],
        ['name' => 'Spinach', 'cal' => 40, 'pro' => 4, 'fat' => 2, 'carb' => 6, 'cost' => 30, 'prep' => 10, 'tags' => ['vegetarian', 'healthy']],
        ['name' => 'Cabbage', 'cal' => 60, 'pro' => 2, 'fat' => 2, 'carb' => 10, 'cost' => 20, 'prep' => 15, 'tags' => ['vegetarian', 'cheap_meal']],
        ['name' => 'Kunde', 'cal' => 70, 'pro' => 5, 'fat' => 2, 'carb' => 12, 'cost' => 40, 'prep' => 20, 'tags' => ['traditional', 'vegetarian']],
        ['name' => 'Pumpkin Leaves', 'cal' => 65, 'pro' => 4, 'fat' => 2, 'carb' => 10, 'cost' => 35, 'prep' => 20, 'tags' => ['traditional', 'vegetarian']],
        ['name' => 'Mixed Veggies', 'cal' => 80, 'pro' => 3, 'fat' => 2, 'carb' => 15, 'cost' => 50, 'prep' => 15, 'tags' => ['vegetarian']],
        ['name' => 'Kachumbari', 'cal' => 30, 'pro' => 1, 'fat' => 0, 'carb' => 6, 'cost' => 25, 'prep' => 10, 'tags' => ['fresh', 'healthy']],
        ['name' => 'None', 'cal' => 0, 'pro' => 0, 'fat' => 0, 'carb' => 0, 'cost' => 0, 'prep' => 0, 'tags' => []],
    ];

    private $extras = [
        ['name' => 'Avocado', 'cal' => 160, 'pro' => 2, 'fat' => 15, 'carb' => 9, 'cost' => 40, 'prep' => 5, 'tags' => ['healthy_fat']],
        ['name' => 'None', 'cal' => 0, 'pro' => 0, 'fat' => 0, 'carb' => 0, 'cost' => 0, 'prep' => 0, 'tags' => []],
        ['name' => 'Yogurt', 'cal' => 100, 'pro' => 5, 'fat' => 2, 'carb' => 14, 'cost' => 70, 'prep' => 2, 'tags' => ['probiotic']],
    ];

    private $breakfast_bases = [
        ['name' => 'Tea', 'cal' => 50, 'pro' => 1, 'fat' => 1, 'carb' => 10, 'cost' => 10, 'prep' => 5, 'tags' => ['quick']],
        ['name' => 'Coffee', 'cal' => 20, 'pro' => 0, 'fat' => 0, 'carb' => 5, 'cost' => 15, 'prep' => 5, 'tags' => ['quick']],
        ['name' => 'Porridge', 'cal' => 180, 'pro' => 4, 'fat' => 2, 'carb' => 40, 'cost' => 20, 'prep' => 15, 'tags' => ['healthy', 'traditional']],
        ['name' => 'Oatmeal', 'cal' => 150, 'pro' => 5, 'fat' => 3, 'carb' => 27, 'cost' => 60, 'prep' => 10, 'tags' => ['healthy']],
        ['name' => 'Yogurt', 'cal' => 120, 'pro' => 6, 'fat' => 4, 'carb' => 15, 'cost' => 80, 'prep' => 2, 'tags' => ['quick']],
    ];

    private $breakfast_items = [
        ['name' => 'Mandazi', 'cal' => 250, 'pro' => 4, 'fat' => 12, 'carb' => 35, 'cost' => 15, 'prep' => 0, 'tags' => ['traditional']],
        ['name' => 'Chapati', 'cal' => 300, 'pro' => 7, 'fat' => 10, 'carb' => 45, 'cost' => 40, 'prep' => 0, 'tags' => ['traditional']],
        ['name' => 'Boiled Eggs', 'cal' => 150, 'pro' => 12, 'fat' => 10, 'carb' => 1, 'cost' => 40, 'prep' => 10, 'tags' => ['high_protein', 'healthy']],
        ['name' => 'Sweet Potatoes', 'cal' => 114, 'pro' => 2, 'fat' => 0, 'carb' => 26, 'cost' => 45, 'prep' => 20, 'tags' => ['traditional', 'healthy']],
        ['name' => 'Arrowroots', 'cal' => 140, 'pro' => 1, 'fat' => 0, 'carb' => 32, 'cost' => 60, 'prep' => 25, 'tags' => ['traditional', 'healthy']],
        ['name' => 'Omelette', 'cal' => 220, 'pro' => 14, 'fat' => 18, 'carb' => 2, 'cost' => 60, 'prep' => 10, 'tags' => ['high_protein']],
        ['name' => 'Bread & Butter', 'cal' => 200, 'pro' => 5, 'fat' => 8, 'carb' => 30, 'cost' => 30, 'prep' => 2, 'tags' => ['quick']],
    ];

    private $snack_items = [
        ['name' => 'Banana', 'cal' => 90, 'pro' => 1, 'fat' => 0, 'carb' => 23, 'cost' => 10, 'prep' => 0, 'tags' => ['fruit', 'healthy']],
        ['name' => 'Roasted Maize', 'cal' => 150, 'pro' => 4, 'fat' => 1, 'carb' => 35, 'cost' => 20, 'prep' => 0, 'tags' => ['street_food']],
        ['name' => 'Samosa', 'cal' => 220, 'pro' => 8, 'fat' => 14, 'carb' => 20, 'cost' => 40, 'prep' => 0, 'tags' => ['street_food']],
        ['name' => 'Groundnuts', 'cal' => 160, 'pro' => 7, 'fat' => 14, 'carb' => 6, 'cost' => 20, 'prep' => 0, 'tags' => ['healthy_fat']],
        ['name' => 'Mango', 'cal' => 100, 'pro' => 1, 'fat' => 0, 'carb' => 25, 'cost' => 50, 'prep' => 0, 'tags' => ['fruit']],
    ];

    public function handle()
    {
        $targetCount = (int) $this->argument('count');
        $this->info("🤖 Generating {$targetCount} AI Meals combinations...");

        $batchSize = 250;
        $meals = [];
        $totalGenerated = 0;

        Recipe::where('is_generated', true)->delete();

        while ($totalGenerated < $targetCount) {
            $typeRoll = mt_rand(1, 100);

            if ($typeRoll <= 20) {
                // Breakfast (20%)
                $base = $this->breakfast_bases[array_rand($this->breakfast_bases)];
                $item = $this->breakfast_items[array_rand($this->breakfast_items)];

                $name = $base['name'] . ' and ' . $item['name'];
                $mealType = 'breakfast';
                $ingredients = $base['name'] . ', ' . $item['name'];

                $cals = $base['cal'] + $item['cal'];
                $pro = $base['pro'] + $item['pro'];
                $fat = $base['fat'] + $item['fat'];
                $crb = $base['carb'] + $item['carb'];
                $cost = $base['cost'] + $item['cost'];
                $prep = max($base['prep'], $item['prep']);
                $tags = array_unique(array_merge($base['tags'], $item['tags'], ['breakfast']));
            } elseif ($typeRoll <= 30) {
                // Snacks (10%)
                $snack = $this->snack_items[array_rand($this->snack_items)];
                $name = $snack['name'] . ' Snack';
                $mealType = 'snack';
                $ingredients = $snack['name'];

                $cals = $snack['cal'];
                $pro = $snack['pro'];
                $fat = $snack['fat'];
                $crb = $snack['carb'];
                $cost = $snack['cost'];
                $prep = $snack['prep'];
                $tags = array_unique(array_merge($snack['tags'], ['snack', 'quick']));
            } else {
                // Lunch/Dinner (70%)
                $carb = $this->carbs[array_rand($this->carbs)];
                $protein = $this->proteins[array_rand($this->proteins)];
                $veggie = $this->veggies[array_rand($this->veggies)];
                $extra = $this->extras[array_rand($this->extras)];

                $nameParts = [$carb['name'], $protein['name']];
                if ($veggie['name'] !== 'None')
                    $nameParts[] = $veggie['name'];

                $name = $carb['name'] . ' + ' . $protein['name'];
                if ($veggie['name'] !== 'None')
                    $name .= ' + ' . $veggie['name'];
                if ($extra['name'] !== 'None' && mt_rand(0, 100) > 60) {
                    $name .= ' and ' . $extra['name'];
                    $nameParts[] = $extra['name'];
                }

                $mealType = mt_rand(0, 1) ? 'lunch' : 'dinner';
                $ingredients = implode(', ', $nameParts);

                $cals = $carb['cal'] + $protein['cal'] + $veggie['cal'] + $extra['cal'];
                $pro = $carb['pro'] + $protein['pro'] + $veggie['pro'] + $extra['pro'];
                $fat = $carb['fat'] + $protein['fat'] + $veggie['fat'] + $extra['fat'];
                $crb = $carb['carb'] + $protein['carb'] + $veggie['carb'] + $extra['carb'];
                $cost = $carb['cost'] + $protein['cost'] + $veggie['cost'] + $extra['cost'];
                $prep = max($carb['prep'], $protein['prep'], $veggie['prep'], $extra['prep']);
                $tags = array_unique(array_merge($carb['tags'], $protein['tags'], $veggie['tags'], $extra['tags'], [$mealType]));
            }

            $healthScore = 70;
            if ($pro > 25)
                $healthScore += 10;
            if ($cals < 600)
                $healthScore += 5;
            if ($fat > 25)
                $healthScore -= 10;

            $meals[] = [
                'user_id' => 1,
                'name' => $name,
                'meal_type' => $mealType,
                'country' => 'Kenya',
                'cuisine_type' => 'Kenyan',
                'calories' => $cals,
                'protein' => $pro,
                'carbs' => $crb,
                'fat' => $fat,
                'estimated_cost' => $cost,
                'prep_time_minutes' => $prep,
                'cooking_time_minutes' => $prep + 10,
                'difficulty_level' => 'Medium',
                'key_ingredients' => strtolower($ingredients),
                'is_healthy' => $healthScore >= 75,
                'is_vegetarian' => in_array('vegetarian', $tags),
                'is_traditional' => in_array('traditional', $tags),
                'health_score' => min(100, $healthScore),
                'diet_type' => $pro > 25 ? 'high_protein' : (in_array('vegetarian', $tags) ? 'vegetarian' : 'balanced'),
                'tags' => json_encode(array_values($tags)),
                'is_generated' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ];

            $totalGenerated++;

            if (count($meals) >= $batchSize) {
                Recipe::insert($meals);
                $meals = [];
                $this->info("... Generated {$totalGenerated} meals.");
            }
        }

        if (count($meals) > 0) {
            Recipe::insert($meals);
        }

        $this->info("✅ Successfully generated {$totalGenerated} combinatorial meals in the database!");
    }
}
