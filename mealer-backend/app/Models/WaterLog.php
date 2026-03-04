<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WaterLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'amount_ml',
        'logged_at',
    ];

    protected $casts = [
        'logged_at' => 'datetime',
        'amount_ml' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
