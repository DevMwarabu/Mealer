<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class GamificationController extends Controller
{
    public function dashboard(Request $request)
    {
        return response()->json([
            'points' => 1250,
            'level' => 4,
            'title' => 'Nutrition Initiate',
            'next_level_points' => 2000,
            'badges' => [
                ['id' => 1, 'name' => 'Consistency King', 'icon' => 'Flame', 'description' => 'Logged meals for 7 days straight', 'earned_date' => '2026-03-01'],
                ['id' => 2, 'name' => 'Budget Master', 'icon' => 'Target', 'description' => 'Stayed under budget for 1 month', 'earned_date' => '2026-02-28'],
            ],
            'active_challenges' => [
                ['id' => 101, 'name' => 'Green Week', 'description' => 'Eat 5 portions of vegetables daily for 7 days', 'progress' => 60, 'reward' => 500, 'days_left' => 3],
                ['id' => 102, 'name' => 'Sodium Shield', 'description' => 'Keep daily sodium below 2000mg for 5 days', 'progress' => 20, 'reward' => 300, 'days_left' => 4],
            ]
        ]);
    }
}
