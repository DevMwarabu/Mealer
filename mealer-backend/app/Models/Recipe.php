<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recipe extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'instructions',
        'health_score',
        'estimated_cost',
        'likes',
        'views',
        'tags',
        'is_public',
        'is_generated',
    ];

    protected $casts = [
        'health_score' => 'integer',
        'estimated_cost' => 'decimal:2',
        'likes' => 'integer',
        'views' => 'integer',
        'tags' => 'array',
        'is_public' => 'boolean',
        'is_generated' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function ingredients()
    {
        return $this->hasMany(RecipeIngredient::class);
    }
}
