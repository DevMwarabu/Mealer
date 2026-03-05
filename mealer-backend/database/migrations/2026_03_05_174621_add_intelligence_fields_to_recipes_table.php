<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('recipes', function (Blueprint $table) {
            $table->decimal('fiber', 6, 2)->default(0)->after('fat');
            $table->decimal('sugar', 6, 2)->default(0)->after('fiber');
            $table->decimal('sodium', 6, 2)->default(0)->after('sugar');
            $table->integer('health_score')->default(70)->after('sodium'); // 0-100
            $table->string('diet_type')->default('balanced')->after('health_score'); // balanced/high_protein/vegetarian/vegan/fitness
            $table->json('tags')->nullable()->after('diet_type'); // ["high_protein","cheap_meal","traditional"]
            $table->string('cuisine_type')->default('Kenyan')->after('tags');
            $table->boolean('is_generated')->default(false)->after('cuisine_type'); // AI-generated combination
        });
    }

    public function down(): void
    {
        Schema::table('recipes', function (Blueprint $table) {
            $table->dropColumn(['fiber', 'sugar', 'sodium', 'health_score', 'diet_type', 'tags', 'cuisine_type', 'is_generated']);
        });
    }
};
