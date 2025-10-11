<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Complaints extends Model
{
    /** @use HasFactory<\Database\Factories\ComplaintsFactory> */
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'media' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function comments()
    {
        return $this->hasMany(Comments::class, 'complaint_id');
    }
}
