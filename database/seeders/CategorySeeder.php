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
        // Create 5 main categories
        $mainCategories = [
            'Infrastructure',
            'Environment',
            'Public Services',
            'Safety & Security',
            'Healthcare'
        ];

        foreach ($mainCategories as $name) {
            Category::factory()->create(['name' => $name]);
        }

        // Create 5 additional random categories
        Category::factory()->count(5)->create();
    }
}
