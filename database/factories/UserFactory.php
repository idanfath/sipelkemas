<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Create more realistic names with Indonesian context
        $firstName = fake()->firstName();
        $lastName = fake()->lastName();
        $name = fake()->boolean(70) ? "$firstName $lastName" : fake()->randomElement([
            "$firstName Sari",
            "$firstName Putri",
            "$firstName Putra",
            "$firstName Wijaya",
            "$firstName Santoso",
            "$firstName Kusuma"
        ]);

        return [
            'name' => $name,
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => fake()->boolean(85) ? now() : null, // 15% unverified
            'role' => fake()->randomElement(['user', 'officer']),
            'profile_picture' => fake()->boolean(30) ? 'profile_pictures/' . fake()->uuid() . '.jpg' : null, // 30% have profile pictures
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Indicate that the model's email address should be verified.
     */
    public function verified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => now(),
        ]);
    }

    /**
     * Configure the model to create an admin user.
     */
    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'admin',
            'email_verified_at' => now(), // Admins are always verified
        ]);
    }

    /**
     * Configure the model to create an officer user.
     */
    public function officer(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'officer',
            'email_verified_at' => now(), // Officers are always verified
        ]);
    }

    /**
     * Configure the model to create a regular user.
     */
    public function user(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'user',
        ]);
    }

    /**
     * Configure the model to have a profile picture.
     */
    public function withProfilePicture(): static
    {
        return $this->state(fn (array $attributes) => [
            'profile_picture' => 'profile_pictures/' . fake()->uuid() . '.jpg',
        ]);
    }
}
