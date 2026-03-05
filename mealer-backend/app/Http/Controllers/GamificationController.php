<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class GamificationController extends Controller
{
    public function dashboard(Request $request)
    {
        $user = $request->user();

        $titles = [
            1 => 'Novice Eater',
            2 => 'Healthy Beginner',
            3 => 'Nutrition Apprentice',
            4 => 'Nutrition Initiate',
            5 => 'Wellness Master'
        ];

        $level = $user->level ?: 1;
        $title = $titles[$level] ?? 'Grandmaster';
        $nextLevelPoints = $level * 500;

        $badges = $user->badges()->orderBy('earned_at', 'desc')->get()->map(function ($b) {
            return [
                'id' => $b->id,
                'name' => $b->name,
                'icon' => $b->icon,
                'description' => $b->description,
                'earned_date' => $b->pivot->earned_at ? \Carbon\Carbon::parse($b->pivot->earned_at)->format('Y-m-d') : null
            ];
        });

        $challenges = $user->challenges()->wherePivot('status', 'active')->get()->map(function ($c) {
            $current = $c->pivot->progress['current'] ?? 0;
            $target = $c->pivot->progress['target'] ?? 100;
            $progressPercent = min(100, round(($current / max(1, $target)) * 100));
            $daysLeft = $c->end_date ? max(0, round(now()->diffInDays($c->end_date, false))) : 0;

            return [
                'id' => $c->id,
                'name' => $c->name,
                'description' => $c->description,
                'progress' => $progressPercent,
                'reward' => $c->reward_points,
                'days_left' => $daysLeft,
            ];
        });

        return response()->json([
            'points' => $user->gamification_points ?: 0,
            'level' => $level,
            'title' => $title,
            'next_level_points' => $nextLevelPoints,
            'badges' => $badges,
            'active_challenges' => $challenges
        ]);
    }
}
