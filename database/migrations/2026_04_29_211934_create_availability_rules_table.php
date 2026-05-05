<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('availability_rules', function (Blueprint $table) {
    $table->id();

    $table->foreignId('resource_id')->constrained()->cascadeOnDelete();

    $table->tinyInteger('day_of_week'); // 0 = Sunday
    $table->time('start_time');
    $table->time('end_time');

    $table->timestamps();

    $table->index(['resource_id', 'day_of_week']);
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('availability_rules');
    }
};
