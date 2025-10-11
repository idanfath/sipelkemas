<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create default users first (required for other seeders)
        $this->createDefaultUsers();

        // Create additional users using factory
        $this->createAdditionalUsers();

        // Call other seeders in proper order
        $this->call([
            CategorySeeder::class,
            ComplaintsSeeder::class,
            CommentsSeeder::class,
        ]);
    }

    /**
     * Create default users that are required for the application.
     */
    private function createDefaultUsers(): void
    {
        // Create admin user
        User::create([
            'email' => 'admin@example.com',
            'name' => 'Eririk Admin',
            'role' => 'admin',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        // Create a default user
        User::create([
            'email' => 'user@example.com',
            'name' => 'Zenzezen User',
            'role' => 'user',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        // Create a default officer
        User::create([
            'email' => 'officer@example.com',
            'name' => 'Agus Officer',
            'role' => 'officer',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
    }

    /**
     * Create additional users using factories.
     */
    private function createAdditionalUsers(): void
    {
        // Create additional regular users
        User::factory()->count(8)->user()->create();

        // Create additional officers
        User::factory()->count(4)->officer()->create();
    }
}
