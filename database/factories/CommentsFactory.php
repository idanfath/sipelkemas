<?php

namespace Database\Factories;

use App\Models\Comments;
use App\Models\Complaints;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Comments>
 */
class CommentsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Get a random user (any role can comment)
        $user = User::inRandomOrder()->first();

        // If no users exist, create one
        if (!$user) {
            $user = User::factory()->create();
        }

        // Get a random complaint
        $complaint = Complaints::inRandomOrder()->first();

        // If no complaints exist, create one
        if (!$complaint) {
            $complaint = Complaints::factory()->create();
        }

        // Random chance to quote another comment (20%)
        $quotedComment = null;
        if (fake()->boolean(20)) {
            $quotedComment = Comments::where('complaint_id', $complaint->id)->inRandomOrder()->first();
        }

        return [
            'complaint_id' => $complaint->id,
            'user_id' => $user->id,
            'quoted_comment_id' => $quotedComment ? $quotedComment->id : null,
            'comment' => fake()->paragraph(random_int(1, 4)),
            'media' => null,
        ];
    }
}
