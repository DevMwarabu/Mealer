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
        // 1. Enhance Meals Table (Denormalization & Health Scoring)
        Schema::table('meals', function (Blueprint $table) {
            if (!Schema::hasColumn('meals', 'total_fiber')) {
                $table->decimal('total_fiber', 8, 2)->default(0)->after('total_sugar');
            }
            if (!Schema::hasColumn('meals', 'health_score_snapshot')) {
                $table->decimal('health_score_snapshot', 5, 2)->nullable()->after('total_fiber');
            }

            // Indexing for performance
            $table->index(['user_id', 'consumed_at'], 'idx_meals_user_date');
        });

        // 2. Enhance Body Metrics Table
        Schema::table('body_metrics', function (Blueprint $table) {
            $table->foreignId('user_id')->after('id')->constrained()->onDelete('cascade');
            $table->decimal('weight', 5, 2)->after('user_id');
            $table->decimal('height', 5, 2)->nullable()->after('weight');
            $table->decimal('bmi', 5, 2)->nullable()->after('height');
            $table->decimal('body_fat', 5, 2)->nullable()->after('bmi');
            $table->timestamp('recorded_at')->after('body_fat');
        });

        // 3. Enhance Water Logs Table
        Schema::table('water_logs', function (Blueprint $table) {
            $table->foreignId('user_id')->after('id')->constrained()->onDelete('cascade');
            $table->integer('amount_ml')->after('user_id');
            $table->timestamp('logged_at')->after('amount_ml');
        });

        // 4. Enhance Ingredients Table
        Schema::table('ingredients', function (Blueprint $table) {
            $table->boolean('is_processed')->default(false)->after('name');
            $table->string('glycemic_impact')->default('Low')->after('is_processed');
            $table->index('category_id', 'idx_ingredients_category');
        });

        // 5. Enhance Groceries Table (Indexes)
        Schema::table('groceries', function (Blueprint $table) {
            $table->index(['user_id', 'purchased_at'], 'idx_groceries_user_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('meals', function (Blueprint $table) {
            $table->dropIndex('idx_meals_user_date');
            $table->dropColumn(['total_fiber', 'health_score_snapshot']);
        });

        Schema::table('body_metrics', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn(['user_id', 'weight', 'height', 'bmi', 'body_fat', 'recorded_at']);
        });

        Schema::table('water_logs', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn(['user_id', 'amount_ml', 'logged_at']);
        });

        Schema::table('ingredients', function (Blueprint $table) {
            $table->dropIndex('idx_ingredients_category');
            $table->dropColumn(['is_processed', 'glycemic_impact']);
        });

        Schema::table('groceries', function (Blueprint $table) {
            $table->dropIndex('idx_groceries_user_date');
        });
    }
};
