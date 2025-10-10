<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comments extends Model
{
    /** @use HasFactory<\Database\Factories\CommentsFactory> */
    use HasFactory;

    protected $guarded = [];

    function complaint() {
        return $this->belongsTo(Complaints::class);
    }

    function user() {
        return $this->belongsTo(User::class);
    }

    function quotedComment() {
        return $this->belongsTo(Comments::class, 'quoted_comment_id');
    }
}
