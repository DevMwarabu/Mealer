<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Recipe; // Assuming Recipe model exists

class RecipeController extends Controller
{
    public function communityFeed(Request $request)
    {
        $trending = Recipe::where('is_public', true)
            ->with('user')
            ->orderBy('likes', 'desc')
            ->take(5)
            ->get()
            ->map(function ($recipe) use ($request) {
                $liked = \App\Models\RecipeLike::where('user_id', $request->user()->id)
                    ->where('recipe_id', $recipe->id)
                    ->exists();

                return [
                    'id' => $recipe->id,
                    'author' => $recipe->user->name,
                    'name' => $recipe->name,
                    'likes' => $recipe->likes,
                    'liked' => $liked,
                    'health_score' => $recipe->health_score,
                    'cost' => 'KES ' . number_format($recipe->estimated_cost, 0),
                    'tags' => $recipe->tags ?: ['General'],
                ];
            });

        $userShared = Recipe::where('user_id', $request->user()->id)
            ->where('is_public', true)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($recipe) {
                return [
                    'id' => $recipe->id,
                    'name' => $recipe->name,
                    'likes' => $recipe->likes,
                    'views' => $recipe->views,
                ];
            });

        return response()->json([
            'trending' => $trending,
            'user_shared' => $userShared
        ]);
    }

    public function toggleLike(Request $request, $id)
    {
        $user = $request->user();
        $recipe = Recipe::findOrFail($id);

        $like = \App\Models\RecipeLike::where('user_id', $user->id)
            ->where('recipe_id', $recipe->id)
            ->first();

        if ($like) {
            $like->delete();
            $recipe->decrement('likes');
            $liked = false;
        } else {
            \App\Models\RecipeLike::create([
                'user_id' => $user->id,
                'recipe_id' => $recipe->id
            ]);
            $recipe->increment('likes');
            $liked = true;
        }

        return response()->json(['liked' => $liked, 'likes_count' => $recipe->likes]);
    }

    public function publish(Request $request, $id)
    {
        $recipe = $request->user()->recipes()->findOrFail($id);
        $recipe->update(['is_public' => true]);
        return response()->json(['message' => 'Recipe published to community.']);
    }
}
