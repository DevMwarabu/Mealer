<?php

namespace App\Http\Controllers;

use App\Models\GroceryItem;
use Illuminate\Http\Request;

class GroceryItemController extends Controller
{
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $item = GroceryItem::findOrFail($id);

        // Ensure user owns the grocery this item belongs to
        if ($item->grocery->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'ingredient_id' => 'required|exists:ingredients,id',
            'quantity' => 'required|numeric',
            'price' => 'required|numeric',
            'expiry_date' => 'nullable|date',
        ]);

        $item->update($request->all());

        // Update total amount of the parent grocery
        $item->grocery->update([
            'total_amount' => $item->grocery->items()->sum('price')
        ]);

        return response()->json($item->load('ingredient'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        $item = GroceryItem::findOrFail($id);

        if ($item->grocery->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $grocery = $item->grocery;
        $item->delete();

        // If no items left in grocery, delete the parent grocery too
        if ($grocery->items()->count() === 0) {
            $grocery->delete();
        } else {
            $grocery->update([
                'total_amount' => $grocery->items()->sum('price')
            ]);
        }

        return response()->json(['message' => 'Item deleted successfully']);
    }
}
