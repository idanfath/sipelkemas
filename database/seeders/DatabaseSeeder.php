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
        // User::factory(10)->create();
        User::create(
            [
                'email' => 'admin@example.com',
                'name' => 'Eririk',
                'role' => 'admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        User::create(
            [
                'email' => 'user@example.com',
                'name' => 'Zenzezen',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        User::create([
            'email' => 'officer@example.com',
            'name' => 'Agus',
            'role' => 'officer',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
    }
}
