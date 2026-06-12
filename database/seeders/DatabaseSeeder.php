<?php

namespace database\seeders;

use App\Models\User;
use App\Models\Resource;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. CREATE SUPER ADMIN
        User::create([
            'name' => 'Super Admin',
            'email' => 'admin@platform.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_verified' => true,
        ]);

        // 2. CREATE A VERIFIED OWNER / PARTNER
        $owner = User::create([
            'name' => 'Anas Vehicle Rental',
            'email' => 'owner@platform.com',
            'password' => Hash::make('password'),
            'role' => 'owner',
            'is_verified' => true, // Already verified so they can host listings
        ]);

        // 3. CREATE A PENDING OWNER (For testing your Admin Approval Table!)
        User::create([
            'name' => 'Atlas Hotel Group',
            'email' => 'pending@platform.com',
            'password' => Hash::make('password'),
            'role' => 'owner',
            'is_verified' => false, // Unverified so they show up as an action item
        ]);

        // 4. CREATE A STANDARD CLIENT / CUSTOMER
        User::create([
            'name' => 'Amine El Amrani',
            'email' => 'client@platform.com',
            'password' => Hash::make('password'),
            'role' => 'customer',
            'is_verified' => true,
        ]);

        // 5. SEED DUMMY RESOURCES (Linked directly to your verified owner!)
        Resource::create([
            'title' => 'Dacia Logan (2024 Edition)',
            'description' => 'Clean rental car, economical diesel engine, perfect for city driving.',
            'type' => 'car',
            'owner_id' => $owner->id,
            'price' => 300.00, // 300 DH
            'pricing_type' => 'daily',
            'location' => 'Casablanca',
            'status' => 'active',
        ]);

        Resource::create([
            'title' => 'Luxury Suite - Ocean View',
            'description' => 'Premium room with double beds, high speed wifi, and balcony.',
            'type' => 'hotel',
            'owner_id' => $owner->id,
            'price' => 850.00, // 850 DH
            'pricing_type' => 'nightly',
            'location' => 'Marrakech',
            'status' => 'active',
        ]);

        Resource::create([
            'title' => 'Synthetic Turf Football Pitch',
            'description' => 'Professional 5-a-side outdoor mini football pitch with stadium lighting.',
            'type' => 'pitch',
            'owner_id' => $owner->id,
            'price' => 150.00, // 150 DH per hour
            'pricing_type' => 'hourly',
            'location' => 'Rabat',
            'status' => 'active',
        ]);
    }
}