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
        Schema::table('resources', function (Blueprint $table) {
            $table->unsignedInteger('max_guests')->default(4)->after('pricing_type');
            $table->boolean('exclude_infants')->default(false)->after('max_guests');
            $table->unsignedInteger('bathrooms')->default(2)->after('exclude_infants');
            $table->boolean('allows_children')->default(false)->after('bathrooms');
        });

        Schema::create('resource_rooms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resource_id')->constrained('resources')->cascadeOnDelete();
            $table->string('room_type', 100);
            $table->string('bed_type', 100);
            $table->timestamps();

            $table->index('resource_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resource_rooms');

        Schema::table('resources', function (Blueprint $table) {
            $table->dropColumn([
                'max_guests',
                'exclude_infants',
                'bathrooms',
                'allows_children',
            ]);
        });
    }
};
