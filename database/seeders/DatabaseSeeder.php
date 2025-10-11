<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Comments;
use App\Models\Complaints;
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
        // Create admin user
        $admin = User::create([
            'email' => 'admin@example.com',
            'name' => 'Eririk Admin',
            'role' => 'admin',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        // Create a default user
        $defaultUser = User::create([
            'email' => 'user@example.com',
            'name' => 'Zenzezen User',
            'role' => 'user',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        // Create a default officer
        $defaultOfficer = User::create([
            'email' => 'officer@example.com',
            'name' => 'Agus Officer',
            'role' => 'officer',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        // Create additional regular users
        $users = User::factory()->count(8)->user()->create();

        // Create additional officers
        $officers = User::factory()->count(4)->officer()->create();

        // Create all available officers (including the default one)
        $allOfficers = $officers->push($defaultOfficer);

        // Create categories
        $defaultCategories = [
            [
                'name' => 'Infrastructure',
                'description' => 'Issues related to roads, buildings, and public facilities',
                'user_id' => $allOfficers->random()->id,
            ],
            [
                'name' => 'Public Services',
                'description' => 'Issues with public services such as waste collection, public transportation',
                'user_id' => $allOfficers->random()->id,
            ],
            [
                'name' => 'Environment',
                'description' => 'Environmental concerns including pollution, illegal logging, etc.',
                'user_id' => $allOfficers->random()->id,
            ],
            [
                'name' => 'Safety & Security',
                'description' => 'Issues regarding public safety, crime, and security concerns',
                'user_id' => $allOfficers->random()->id,
            ],
            [
                'name' => 'Healthcare',
                'description' => 'Issues related to public health services and facilities',
                'user_id' => $allOfficers->random()->id,
            ]
        ];

        foreach ($defaultCategories as $category) {
            Category::create($category);
        }

        // Create additional categories
        $additionalCategories = Category::factory()->count(5)->create();

        // All categories
        $allCategories = Category::all();

        // Create complaints
        // Some with defined status
        $pendingComplaints = Complaints::factory()->count(10)->pending()->create();
        $inProgressComplaints = Complaints::factory()->count(7)->inProgress()->create();
        $resolvedComplaints = Complaints::factory()->count(5)->resolved()->create();

        // Random status complaints
        $randomComplaints = Complaints::factory()->count(8)->create();

        // All complaints
        $allComplaints = Complaints::all();

        // Create comments for each complaint (2-8 comments per complaint)
        foreach ($allComplaints as $complaint) {
            $commentsCount = random_int(2, 8);

            // First comment usually by the officer assigned to the category
            $officerId = Category::find($complaint->category_id)->user_id;

            Comments::create([
                'complaint_id' => $complaint->id,
                'user_id' => $officerId,
                'comment' => 'Thank you for submitting your complaint. We will look into this issue.',
                'media' => null,
            ]);

            // Create the rest of the comments
            Comments::factory()->count($commentsCount - 1)->create([
                'complaint_id' => $complaint->id,
            ]);
        }
    }
}
