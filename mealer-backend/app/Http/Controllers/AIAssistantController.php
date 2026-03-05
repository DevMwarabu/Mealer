<?php

namespace App\Http\Controllers;

use App\Services\AIAssistantService;
use Illuminate\Http\Request;

class AIAssistantController extends Controller
{
    protected $assistantService;

    public function __construct(AIAssistantService $assistantService)
    {
        $this->assistantService = $assistantService;
    }

    public function ask(Request $request)
    {
        $request->validate([
            'query' => 'required|string|max:500'
        ]);

        $user = $request->user();
        $response = $this->assistantService->ask($user, $request->query);

        return response()->json($response);
    }
}
