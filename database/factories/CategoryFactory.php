<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Get a random officer user
        $officerUser = User::where('role', 'officer')->inRandomOrder()->first();

        // If no officer users exist, create one
        if (!$officerUser) {
            $officerUser = User::factory()->officer()->create();
        }

        return [
            'name' => fake()->unique()->words(random_int(1, 3), true),
            'description' => fake()->sentence(random_int(5, 15)),
            'user_id' => $officerUser->id,
        ];
    }
}
