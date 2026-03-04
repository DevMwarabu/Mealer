<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Meal extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'meal_type',
        'consumed_at',
        'total_cost',
        'total_calories',
        'total_protein',
        'total_carbs',
        'total_fat',
        'total_fiber',
        'total_sodium',
        'total_sugar',
        'health_score_snapshot',
        'notes',
    ];

    protected $casts = [
        'consumed_at' => 'datetime',
        'total_cost' => 'decimal:2',
        'total_calories' => 'integer',
        'total_protein' => 'decimal:2',
        'total_carbs' => 'decimal:2',
        'total_fat' => 'decimal:2',
        'total_fiber' => 'decimal:2',
        'total_sodium' => 'decimal:2',
        'total_sugar' => 'decimal:2',
        'health_score_snapshot' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(MealItem::class);
    }
}
