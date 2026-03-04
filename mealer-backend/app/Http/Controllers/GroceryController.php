<?php

namespace App\Http\Controllers;

use App\Services\FinancialIntelligenceService;
use App\Models\Grocery;
use Illuminate\Http\Request;

class GroceryController extends Controller
{
    protected $financialService;

    public function __construct(FinancialIntelligenceService $financialService)
    {
        $this->financialService = $financialService;
    }

    public function index(Request $request)
    {
        return $request->user()->groceries()
            ->with('items.ingredient')
            ->orderBy('purchased_at', 'desc')
            ->get();
    }

    public function getMetrics(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'waste' => $this->financialService->getWasteMetrics($user),
            'bulk_roi' => $this->financialService->getBulkROI($user),
            'efficiency' => $this->financialService->getNutritionalEfficiency($user),
            'monthly_total' => $user->groceries()->whereMonth('purchased_at', now()->month)->sum('total_amount'),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'store_name' => 'nullable|string',
            'purchased_at' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.ingredient_id' => 'required|exists:ingredients,id',
            'items.*.quantity' => 'required|numeric',
            'items.*.price' => 'required|numeric',
            'items.*.expiry_date' => 'nullable|date',
        ]);

        $grocery = $request->user()->groceries()->create([
            'store_name' => $request->store_name,
            'purchased_at' => $request->purchased_at,
            'total_amount' => collect($request->items)->sum('price'),
        ]);

        foreach ($request->items as $itemData) {
            $grocery->items()->create($itemData);
        }

        return response()->json($grocery->load('items.ingredient'), 201);
    }
}
