<?php

use App\Http\Controllers\AIController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MealController;
use App\Http\Controllers\GroceryController;
use App\Http\Controllers\HealthController;
use App\Http\Controllers\PantryController;
use App\Http\Controllers\GamificationController;
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\AutoPlanController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);

    // Meals
    Route::apiResource('meals', MealController::class);

    // Grocery Intelligence
    Route::prefix('groceries')->group(function () {
        Route::get('/', [GroceryController::class, 'index']);
        Route::get('/metrics', [GroceryController::class, 'getMetrics']);
        Route::post('/', [GroceryController::class, 'store']);
    });

    // AI Intelligence
    Route::prefix('ai')->group(function () {
        Route::post('/estimate-nutrition', [AIController::class, 'estimateNutrition']);
        Route::post('/plan-month', [AIController::class, 'planMonth']);
    });

    // Health Intelligence
    Route::prefix('health')->group(function () {
        Route::get('/daily-score', [HealthController::class, 'getDailyScore']);
        Route::get('/metrics', [HealthController::class, 'getBodyMetrics']);
        Route::get('/diversity', [HealthController::class, 'getDiversity']);
        Route::get('/risks', [HealthController::class, 'getRisks']);
        Route::get('/habits', [HealthController::class, 'getHabits']);
        Route::post('/water', [HealthController::class, 'logWater']);
    });

    // Phase 4: Extended Ecosystem
    Route::get('/pantry', [PantryController::class, 'index']);
    Route::get('/gamification/dashboard', [GamificationController::class, 'dashboard']);
    Route::get('/community/feed', [RecipeController::class, 'communityFeed']);

    // Phase 5: Proactive Intelligence
    Route::post('/plan/baseline', [AutoPlanController::class, 'generateBaseline']);
    Route::get('/plan/today', [AutoPlanController::class, 'getToday']);
    Route::post('/plan/recalculate', [AutoPlanController::class, 'recalculate']);
});
