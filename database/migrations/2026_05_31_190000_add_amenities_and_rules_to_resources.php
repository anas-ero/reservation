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
            $table->boolean('breakfast_included')->default(false)->after('allows_children');
            $table->boolean('smoking_allowed')->default(false)->after('breakfast_included');
            $table->boolean('parties_allowed')->default(false)->after('smoking_allowed');
            $table->enum('pets_allowed', ['yes', 'no', 'upon_request'])->default('no')->after('parties_allowed');
            $table->time('check_in_from')->nullable()->after('pets_allowed');
            $table->time('check_in_until')->nullable()->after('check_in_from');
            $table->time('check_out_from')->nullable()->after('check_in_until');
            $table->time('check_out_until')->nullable()->after('check_out_from');
        });

        Schema::create('amenities', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->timestamps();
        });

        Schema::create('resource_amenities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resource_id')->constrained('resources')->cascadeOnDelete();
            $table->foreignId('amenity_id')->constrained('amenities')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['resource_id', 'amenity_id']);
        });

        Schema::create('languages', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->timestamps();
        });

        Schema::create('resource_languages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resource_id')->constrained('resources')->cascadeOnDelete();
            $table->foreignId('language_id')->constrained('languages')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['resource_id', 'language_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resource_languages');
        Schema::dropIfExists('languages');
        Schema::dropIfExists('resource_amenities');
        Schema::dropIfExists('amenities');

        Schema::table('resources', function (Blueprint $table) {
            $table->dropColumn([
                'breakfast_included',
                'smoking_allowed',
                'parties_allowed',
                'pets_allowed',
                'check_in_from',
                'check_in_until',
                'check_out_from',
                'check_out_until',
            ]);
        });
    }
};
