<?php

namespace Database\Factories;

use App\Models\Resource;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<resource>
 */
class ResourceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types = ['car', 'hotel', 'pitch'];

        return [
            'title' => fake()->words(3, true),
            'description' => fake()->sentence(),
            'type' => fake()->randomElement($types),
            'owner_id' => User::query()->where('role', '=', 'owner')->inRandomOrder()->value('id'),
            'price' => fake()->numberBetween(10, 200),
            'pricing_type' => fake()->randomElement(['hourly', 'daily', 'nightly']),
            'location' => 'Casablanca',
            'status' => 'active',
        ];
    }
}
