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
        return [
            'name' => fake()->unique()->words(2, true),
            'description' => fake()->sentence(8),
            'user_id' => User::factory()->officer(),
        ];
    }

    /**
     * Assign a specific officer to the category.
     */
    public function assignToOfficer(User $officer): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $officer->id,
        ]);
    }
}
