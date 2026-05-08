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
        Schema::table('users', function (Blueprint $table) {
            // Boolean to track if the admin approved them
            $table->boolean('is_verified')->default(false);

            // Professional details to collect during registration
            $table->string('business_name')->nullable();
            $table->string('cin_or_rc')->nullable(); // CIN or Registre de Commerce
            $table->string('phone_number')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['is_verified', 'business_name', 'cin_or_rc', 'phone_number']);
        });
    }
};
