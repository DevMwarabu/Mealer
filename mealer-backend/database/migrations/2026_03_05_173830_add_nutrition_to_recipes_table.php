<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('recipes', function (Blueprint $table) {
            $table->string('meal_type')->default('lunch')->after('name'); // breakfast/lunch/dinner/snack
            $table->string('country')->default('Kenya')->after('meal_type');
            $table->integer('calories')->default(0)->after('country');
            $table->decimal('protein', 6, 2)->default(0)->after('calories');
            $table->decimal('carbs', 6, 2)->default(0)->after('protein');
            $table->decimal('fat', 6, 2)->default(0)->after('carbs');
            $table->decimal('estimated_cost', 10, 2)->default(0)->after('fat'); // KES
            $table->integer('prep_time_minutes')->default(20)->after('estimated_cost');
            $table->string('difficulty_level')->default('Easy')->after('prep_time_minutes');
            $table->text('key_ingredients')->nullable()->after('difficulty_level'); // comma-separated
            $table->boolean('is_healthy')->default(true)->after('key_ingredients');
            $table->boolean('is_vegetarian')->default(false)->after('is_healthy');
            $table->boolean('is_traditional')->default(false)->after('is_vegetarian');
        });
    }

    public function down(): void
    {
        Schema::table('recipes', function (Blueprint $table) {
            $table->dropColumn([
                'meal_type',
                'country',
                'calories',
                'protein',
                'carbs',
                'fat',
                'estimated_cost',
                'prep_time_minutes',
                'difficulty_level',
                'key_ingredients',
                'is_healthy',
                'is_vegetarian',
                'is_traditional'
            ]);
        });
    }
};
