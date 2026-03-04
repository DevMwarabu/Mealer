<?php

namespace App\Http\Controllers;

use App\Models\Meal;
use App\Models\MealItem;
use App\Services\MealService;
use Illuminate\Http\Request;

class MealController extends Controller
{
    use \Illuminate\Foundation\Auth\Access\AuthorizesRequests;

    protected $mealService;

    public function __construct(MealService $mealService)
    {
        $this->mealService = $mealService;
    }

    public function index(Request $request)
    {
        return $request->user()->meals()
            ->with('items.ingredient')
            ->orderBy('consumed_at', 'desc')
            ->paginate(15);
    }

    public function store(Request $request)
    {
        $request->validate([
            'meal_type' => 'required|in:breakfast,lunch,dinner,snack',
            'consumed_at' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.ingredient_id' => 'required|exists:ingredients,id',
            'items.*.quantity' => 'required|numeric|min:0.01',
        ]);

        $meal = $request->user()->meals()->create([
            'meal_type' => $request->meal_type,
            'consumed_at' => $request->consumed_at,
            'notes' => $request->notes,
        ]);

        foreach ($request->items as $itemData) {
            $meal->items()->create($itemData);
        }

        $this->mealService->updateMealTotals($meal);

        return response()->json($meal->load('items.ingredient'), 201);
    }

    public function show(Meal $meal)
    {
        $this->authorize('view', $meal);
        return $meal->load('items.ingredient');
    }
}
