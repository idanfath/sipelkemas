<?php

namespace Database\Seeders;

use App\Models\Comments;
use App\Models\Complaints;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CommentsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all complaints
        $complaints = Complaints::all();

        if ($complaints->isEmpty()) {
            // Create some complaints if none exist
            $complaints = Complaints::factory()->count(5)->create();
        }

        // For each complaint, add 2-8 comments
        foreach ($complaints as $complaint) {
            $commentCount = random_int(2, 8);
            Comments::factory()->count($commentCount)->create([
                'complaint_id' => $complaint->id
            ]);
        }
    }
}
