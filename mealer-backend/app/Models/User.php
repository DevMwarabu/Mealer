<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'daily_calorie_target',
        'monthly_budget_target',
        'height',
        'weight',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'daily_calorie_target' => 'integer',
            'monthly_budget_target' => 'decimal:2',
            'height' => 'decimal:2',
            'weight' => 'decimal:2',
        ];
    }

    public function meals()
    {
        return $this->hasMany(Meal::class);
    }

    public function groceries()
    {
        return $this->hasMany(Grocery::class);
    }

    public function recipes()
    {
        return $this->hasMany(Recipe::class);
    }

    public function waterLogs()
    {
        return $this->hasMany(WaterLog::class);
    }

    public function bodyMetrics()
    {
        return $this->hasMany(BodyMetric::class);
    }

    public function aiLogs()
    {
        return $this->hasMany(AILog::class);
    }

    public function alerts()
    {
        return $this->hasMany(Alert::class);
    }
}
