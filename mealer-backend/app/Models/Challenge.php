<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Challenge extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'reward_points', 'start_date', 'end_date', 'criteria'];

    protected $casts = [
        'criteria' => 'array',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_challenges')
            ->withPivot('status', 'progress', 'completed_at')
            ->withTimestamps();
    }
}
