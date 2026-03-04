<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ingredient extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'is_processed',
        'glycemic_impact',
        'category_id',
        'avg_price',
        'calories_per_unit',
        'protein',
        'carbs',
        'fat',
        'fiber',
        'iron',
        'calcium',
        'vitamin_d',
        'sodium',
        'sugar',
    ];

    public function category()
    {
        return $this->belongsTo(IngredientCategory::class);
    }

    public function mealItems()
    {
        return $this->hasMany(MealItem::class);
    }

    public function groceryItems()
    {
        return $this->hasMany(GroceryItem::class);
    }

    public function recipeIngredients()
    {
        return $this->hasMany(RecipeIngredient::class);
    }
}
