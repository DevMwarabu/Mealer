<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserBadge extends Model
{
    use HasFactory;

    public $timestamps = true;
    protected $table = 'user_badges';

    protected $fillable = ['user_id', 'badge_id', 'earned_at'];

    protected $casts = [
        'earned_at' => 'datetime',
    ];
}
