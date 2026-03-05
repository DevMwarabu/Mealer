<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MonthlyPlan extends Model
{
    protected $fillable = ['user_id', 'strategy', 'plan_data'];

    protected $casts = [
        'plan_data' => 'array',
    ];
}
