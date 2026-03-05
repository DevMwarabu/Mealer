<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GamificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = \App\Models\User::first();
        if (!$user)
            return;

        // Create Badges
        $consistencyBadge = \App\Models\Badge::firstOrCreate([
            'name' => 'Consistency King',
        ], [
            'description' => 'Logged meals for 7 days straight',
            'icon' => 'Flame',
            'criteria' => ['days_logged' => 7]
        ]);

        $budgetBadge = \App\Models\Badge::firstOrCreate([
            'name' => 'Budget Master',
        ], [
            'description' => 'Stayed under budget for 1 month',
            'icon' => 'Target',
            'criteria' => ['months_under_budget' => 1]
        ]);

        // Assign Badges
        $user->badges()->syncWithoutDetaching([
            $consistencyBadge->id => ['earned_at' => now()->subDays(2)],
            $budgetBadge->id => ['earned_at' => now()->subDays(5)]
        ]);

        // Create Challenges
        $greenChallenge = \App\Models\Challenge::firstOrCreate([
            'name' => 'Green Week',
        ], [
            'description' => 'Eat 5 portions of vegetables daily for 7 days',
            'reward_points' => 500,
            'start_date' => now()->subDays(2),
            'end_date' => now()->addDays(5),
            'criteria' => ['veg_portions' => 35]
        ]);

        $sodiumChallenge = \App\Models\Challenge::firstOrCreate([
            'name' => 'Sodium Shield',
        ], [
            'description' => 'Keep daily sodium below 2000mg for 5 days',
            'reward_points' => 300,
            'start_date' => now()->subDays(1),
            'end_date' => now()->addDays(4),
            'criteria' => ['sodium_limit' => 2000, 'days' => 5]
        ]);

        // Assign active challenges to user
        $user->challenges()->syncWithoutDetaching([
            $greenChallenge->id => [
                'status' => 'active',
                'progress' => json_encode(['current' => 15, 'target' => 35])
            ],
            $sodiumChallenge->id => [
                'status' => 'active',
                'progress' => json_encode(['current' => 1, 'target' => 5])
            ]
        ]);

        // Give user some points
        $user->update([
            'gamification_points' => 1250,
            'level' => 4
        ]);
    }
}
