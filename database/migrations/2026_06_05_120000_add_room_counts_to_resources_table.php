<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('resources', function (Blueprint $table) {
            $table->unsignedInteger('beds')->default(0)->after('bathrooms');
            $table->unsignedInteger('bedrooms')->default(0)->after('beds');
            $table->unsignedInteger('other_rooms')->default(0)->after('bedrooms');
        });
    }

    public function down(): void
    {
        Schema::table('resources', function (Blueprint $table) {
            $table->dropColumn([
                'beds',
                'bedrooms',
                'other_rooms',
            ]);
        });
    }
};
