<?php

namespace Database\Seeders;

use App\Models\Complaints;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ComplaintsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create complaints with defined statuses
        Complaints::factory()->count(10)->pending()->create();
        Complaints::factory()->count(7)->inProgress()->create();
        Complaints::factory()->count(5)->resolved()->create();

        // Create some complaints with random statuses
        Complaints::factory()->count(8)->create();
    }
}
