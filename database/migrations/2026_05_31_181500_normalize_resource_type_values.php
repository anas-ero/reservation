<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('resources')->whereIn('type', ['stays', 'villa'])->update(['type' => 'hotel']);
        DB::table('resources')->whereIn('type', ['cars'])->update(['type' => 'car']);
        DB::table('resources')->whereIn('type', ['sports', 'sports_pitch'])->update(['type' => 'pitch']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // no-op: this is a data normalization migration
    }
};
