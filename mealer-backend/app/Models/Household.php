<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Household extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'collective_monthly_budget'
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
