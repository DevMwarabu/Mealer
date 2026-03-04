<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Households for Family Orchestration
        Schema::create('households', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('collective_monthly_budget', 12, 2)->nullable();
            $table->timestamps();
        });

        // 2. Enhance Users
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('household_id')->nullable()->constrained()->onDelete('set null');
            $table->decimal('discipline_score', 5, 2)->default(100.0);
            $table->json('taste_preferences')->nullable();
        });

        // 3. Advanced Ingredient Intelligence
        Schema::table('ingredients', function (Blueprint $table) {
            $table->decimal('nutrient_density_score', 5, 2)->default(0);
            $table->decimal('anti_inflammatory_score', 5, 2)->default(0);
            $table->decimal('gut_health_score', 5, 2)->default(0);
            $table->decimal('metabolic_impact_score', 5, 2)->default(0);
            $table->decimal('iron_content_mg', 8, 2)->default(0);
            $table->decimal('calcium_content_mg', 8, 2)->default(0);
            $table->decimal('potassium_content_mg', 8, 2)->default(0);
            $table->decimal('carbon_footprint_kg', 8, 2)->default(0);
            $table->boolean('is_seasonal')->default(false);
            $table->decimal('historical_avg_price', 12, 2)->nullable();
        });

        // 4. Recipe Context
        Schema::table('recipes', function (Blueprint $table) {
            $table->integer('cooking_time_minutes')->default(20);
            $table->string('complexity_level')->default('Medium'); // Low, Medium, High
        });

        // 5. Daily Intelligence Snapshots (New Table)
        Schema::create('daily_intelligence_snapshots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->decimal('macro_accuracy_score', 5, 2)->default(0);
            $table->decimal('diversity_score', 5, 2)->default(0);
            $table->decimal('budget_compliance_score', 5, 2)->default(0);
            $table->decimal('waste_management_score', 5, 2)->default(0);
            $table->decimal('overall_daily_grade', 5, 2)->default(0);
            $table->timestamps();
            $table->unique(['user_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daily_intelligence_snapshots');
        Schema::table('recipes', function (Blueprint $table) {
            $table->dropColumn(['cooking_time_minutes', 'complexity_level']);
        });
        Schema::table('ingredients', function (Blueprint $table) {
            $table->dropColumn([
                'nutrient_density_score',
                'anti_inflammatory_score',
                'gut_health_score',
                'metabolic_impact_score',
                'iron_content_mg',
                'calcium_content_mg',
                'potassium_content_mg',
                'carbon_footprint_kg',
                'is_seasonal',
                'historical_avg_price'
            ]);
        });
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['household_id']);
            $table->dropColumn(['household_id', 'discipline_score', 'taste_preferences']);
        });
        Schema::dropIfExists('households');
    }
};
