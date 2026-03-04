<?php

use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Custom rate limit exceeded response
        $exceptions->render(function (TooManyRequestsHttpException $e) {
            return response()->json([
                'error' => 'Too Many Requests',
                'message' => 'You have exceeded the rate limit of 100 requests per minute.',
                'retry_after' => $e->getHeaders()['Retry-After'] ?? 60,
            ], 429, [
                'Retry-After' => $e->getHeaders()['Retry-After'] ?? 60,
                'X-RateLimit-Limit' => '100',
                'X-RateLimit-Remaining' => '0',
            ]);
        });
    })->create();
