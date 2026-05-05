<?php

namespace Database\Factories;

use App\Models\Reservation;
use App\Models\Resource;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Reservation>
 */
class ReservationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $start = fake()->dateTimeBetween('+1 days', '+1 month');
        $end = (clone $start)->modify('+1 hour');

        return [
            'user_id' => User::query()->where('role', '=', 'customer')->inRandomOrder()->first()?->id,
            'resource_id' => Resource::query()->inRandomOrder()->first()?->id,
            'start_time' => $start,
            'end_time' => $end,
            'total_price' => fake()->numberBetween(20, 200),
            'status' => 'confirmed',
        ];
    }
}
