<?php

namespace App\Http\Controllers;

use App\Models\PantryItem;
use Illuminate\Http\Request;

class PantryController extends Controller
{
    public function index(Request $request)
    {
        // Mocking user Auth for now
        // $user = $request->user();

        // Mock Data for UI presentation
        return response()->json([
            'inventory' => [
                ['id' => 1, 'name' => 'Olive Oil', 'quantity' => 0.5, 'unit' => 'L', 'status' => 'Good', 'expiry_date' => '2026-10-15'],
                ['id' => 2, 'name' => 'Basmati Rice', 'quantity' => 2.5, 'unit' => 'kg', 'status' => 'Good', 'expiry_date' => '2027-01-20'],
                ['id' => 3, 'name' => 'Almond Milk', 'quantity' => 0.2, 'unit' => 'L', 'status' => 'Low', 'expiry_date' => '2026-03-10'],
                ['id' => 4, 'name' => 'Eggs', 'quantity' => 6, 'unit' => 'pcs', 'status' => 'Warning', 'expiry_date' => '2026-03-08'],
            ],
            'metrics' => [
                'total_items' => 14,
                'low_stock' => 3,
                'expiring_soon' => 1,
                'waste_prevented_value' => 'KES 450'
            ]
        ]);
    }
}
