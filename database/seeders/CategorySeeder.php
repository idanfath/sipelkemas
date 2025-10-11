<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Make sure we have at least one officer
        $officer = User::where('role', 'officer')->first();
        if (!$officer) {
            $officer = User::factory()->officer()->create();
        }

        // Create default categories
        $defaultCategories = [
            [
                'name' => 'Infrastructure',
                'description' => 'Issues related to roads, buildings, and public facilities',
                'user_id' => $officer->id,
            ],
            [
                'name' => 'Public Services',
                'description' => 'Issues with public services such as waste collection, public transportation',
                'user_id' => $officer->id,
            ],
            [
                'name' => 'Environment',
                'description' => 'Environmental concerns including pollution, illegal logging, etc.',
                'user_id' => $officer->id,
            ],
            [
                'name' => 'Safety & Security',
                'description' => 'Issues regarding public safety, crime, and security concerns',
                'user_id' => $officer->id,
            ],
            [
                'name' => 'Healthcare',
                'description' => 'Issues related to public health services and facilities',
                'user_id' => $officer->id,
            ]
        ];

        foreach ($defaultCategories as $category) {
            Category::create($category);
        }

        // Create additional random categories
        Category::factory()->count(5)->create();
    }
}
