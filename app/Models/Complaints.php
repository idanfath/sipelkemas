<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Complaints extends Model
{
    /** @use HasFactory<\Database\Factories\ComplaintsFactory> */
    use HasFactory;

    protected $guarded = [];

    function user() {
        return $this->belongsTo(User::class);
    }

    function category() {
        return $this->belongsTo(Category::class);
    }

    function comments() {
        return $this->hasMany(Comments::class);
    }
}
