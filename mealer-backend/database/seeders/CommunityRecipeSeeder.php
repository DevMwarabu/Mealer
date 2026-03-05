<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CommunityRecipeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = \App\Models\User::first();
        if (!$user)
            return;

        $recipes = [
            [
                'name' => 'High-Protein Quinoa Bowl',
                'description' => 'A nutrient-dense bowl with diverse amino acids.',
                'health_score' => 96,
                'estimated_cost' => 450,
                'tags' => ['Vegan', 'High Protein'],
                'likes' => 342,
                'is_public' => true,
                'user_id' => $user->id,
            ],
            [
                'name' => 'Low-Carb Turkey Wraps',
                'description' => 'Quick metabolic-friendly wraps.',
                'health_score' => 88,
                'estimated_cost' => 320,
                'tags' => ['Keto', 'Quick'],
                'likes' => 215,
                'is_public' => true,
                'user_id' => $user->id,
            ],
            [
                'name' => 'Lentil Curry',
                'description' => 'Budget fiber-rich traditional curry.',
                'health_score' => 92,
                'estimated_cost' => 180,
                'tags' => ['Budget', 'Fiber'],
                'likes' => 512,
                'is_public' => true,
                'user_id' => $user->id,
            ],
            [
                'name' => 'Classic Sukuma Wiki with Beef',
                'description' => 'A Kenyan staple optimized for iron absorption.',
                'health_score' => 94,
                'estimated_cost' => 250,
                'tags' => ['Traditional', 'Iron-Rich'],
                'likes' => 89,
                'is_public' => true,
                'user_id' => $user->id,
            ],
        ];

        foreach ($recipes as $recipe) {
            \App\Models\Recipe::create($recipe);
        }
    }
}
