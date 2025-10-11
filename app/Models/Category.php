<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    /** @use HasFactory<\Database\Factories\CategoryFactory> */
    use HasFactory;

    protected $guarded = [];

    function officer() {
        return $this->belongsTo(User::class, 'user_id');
    }

    function complaints() {
        return $this->hasMany(Complaints::class);
    }
}
