<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Resource;
use App\Models\ResourceImage;
use App\Models\ResourceMeta;
use App\Models\AvailabilityRule;
use App\Models\Reservation;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
{
    // Create users
    $owners = User::factory()->count(5)->create(['role' => 'owner']);
    $customers = User::factory()->count(10)->create(['role' => 'customer']);

    // Create resources
    $resources = Resource::factory()->count(15)->create();

    // images + meta + availability
    foreach ($resources as $resource) {

        ResourceImage::create([
            'resource_id' => $resource->id,
            'path' => 'images/default.jpg',
            'is_primary' => true,
        ]);

        ResourceMeta::create([
            'resource_id' => $resource->id,
            'key' => 'example',
            'value' => 'value',
        ]);

        // availability (only useful for pitch)
        for ($day = 0; $day <= 6; $day++) {
            AvailabilityRule::create([
                'resource_id' => $resource->id,
                'day_of_week' => $day,
                'start_time' => '09:00:00',
                'end_time' => '23:00:00',
            ]);
        }
    }


    Reservation::factory()->count(20)->create();
}

   
}
