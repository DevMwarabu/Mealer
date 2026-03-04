<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AILog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'log_type',
        'context',
        'prediction',
        'confidence',
    ];

    protected $casts = [
        'context' => 'json',
        'prediction' => 'json',
        'confidence' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
