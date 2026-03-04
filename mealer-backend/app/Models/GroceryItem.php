<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GroceryItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'grocery_id',
        'ingredient_id',
        'quantity',
        'price',
        'expiry_date',
        'health_grade',
        'food_classification',
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
        'price' => 'decimal:2',
        'expiry_date' => 'date',
    ];

    public function grocery()
    {
        return $this->belongsTo(Grocery::class);
    }

    public function ingredient()
    {
        return $this->belongsTo(Ingredient::class);
    }
}
