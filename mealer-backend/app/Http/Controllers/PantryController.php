<?php

namespace App\Http\Controllers;

use App\Models\PantryItem;
use Illuminate\Http\Request;

class PantryController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $inventory = $user->pantryItems()
            ->with('ingredient')
            ->orderBy('expiry_date', 'asc')
            ->get()
            ->map(function ($item) {
                // Calculate status
                if ($item->quantity <= $item->min_threshold) {
                    $status = 'Low';
                } elseif ($item->expiry_date && $item->expiry_date->diffInDays(now()) <= 7) {
                    $status = 'Warning';
                } else {
                    $status = 'Good';
                }

                return [
                    'id' => $item->id,
                    'ingredient_id' => $item->ingredient_id,
                    'name' => $item->ingredient->name,
                    'quantity' => (float) $item->quantity,
                    'unit' => $item->unit,
                    'status' => $status,
                    'expiry_date' => $item->expiry_date ? $item->expiry_date->toDateString() : null,
                    'min_threshold' => (float) $item->min_threshold
                ];
            });

        return response()->json([
            'inventory' => $inventory,
            'metrics' => [
                'total_items' => $inventory->count(),
                'low_stock' => $inventory->where('status', 'Low')->count(),
                'expiring_soon' => $inventory->where('status', 'Warning')->count(),
                'waste_prevented_value' => 'KES ' . ($inventory->where('status', 'Good')->count() * 150) // Simplified metric for now
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'ingredient_id' => 'required|exists:ingredients,id',
            'quantity' => 'required|numeric',
            'unit' => 'required|string',
            'expiry_date' => 'nullable|date',
            'min_threshold' => 'nullable|numeric'
        ]);

        $item = $request->user()->pantryItems()->create($request->all());

        return response()->json($item->load('ingredient'), 201);
    }

    public function update(Request $request, $id)
    {
        $item = $request->user()->pantryItems()->findOrFail($id);

        $request->validate([
            'ingredient_id' => 'required|exists:ingredients,id',
            'quantity' => 'required|numeric',
            'unit' => 'required|string',
            'expiry_date' => 'nullable|date',
            'min_threshold' => 'nullable|numeric'
        ]);

        $item->update($request->all());

        return response()->json($item->load('ingredient'));
    }

    public function destroy(Request $request, $id)
    {
        $item = $request->user()->pantryItems()->findOrFail($id);
        $item->delete();

        return response()->json(['message' => 'Item removed from pantry']);
    }
}
