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
        Schema::create('resources', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->text('description')->nullable();

    $table->string('type'); // car, hotel, pitch
    $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();

    $table->decimal('price', 10, 2);
    $table->enum('pricing_type', ['hourly', 'daily', 'nightly']);

    $table->string('location')->nullable();
    $table->decimal('lat', 10, 8)->nullable();
    $table->decimal('lng', 11, 8)->nullable();

    $table->enum('status', ['active', 'inactive'])->default('active');

    $table->timestamps();

    $table->index(['type']);
    $table->index(['lat', 'lng']);
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ressources');
    }
};
