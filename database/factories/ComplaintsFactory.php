<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Complaints>
 */
class ComplaintsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Get a random regular user
        $user = User::where('role', 'user')->inRandomOrder()->first();

        // If no regular users exist, create one
        if (!$user) {
            $user = User::factory()->user()->create();
        }

        // Get a random category
        $category = Category::inRandomOrder()->first();

        // If no categories exist, create one
        if (!$category) {
            $category = Category::factory()->create();
        }

        return [
            'user_id' => $user->id,
            'category_id' => $category->id,
            'title' => fake()->sentence(random_int(3, 8)),
            'description' => fake()->paragraphs(random_int(1, 3), true),
            'status' => fake()->randomElement(['pending', 'in_progress', 'resolved']),
            'media' => null,
            'is_anonymous' => fake()->boolean(20), // 20% chance of being anonymous
        ];
    }

    /**
     * Configure the model for a pending complaint.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
        ]);
    }

    /**
     * Configure the model for an in-progress complaint.
     */
    public function inProgress(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'in_progress',
        ]);
    }

    /**
     * Configure the model for a resolved complaint.
     */
    public function resolved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'resolved',
        ]);
    }
}
