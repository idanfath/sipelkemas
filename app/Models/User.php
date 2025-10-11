<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'role',
        'password',
        'profile_picture',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'profile_picture_url',
        'default_profile_picture',
        'profile_picture_or_default',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function complaints()
    {
        if ($this->role === 'user') {
            return $this->hasMany(Complaints::class);
        }

        return null;
    }

    public function categories()
    {
        if ($this->role === 'officer') {
            return $this->hasMany(Category::class, 'user_id');
        }

        return null;
    }

    public function comments()
    {
        return $this->hasMany(Comments::class);
    }

    /**
     * Get the profile picture URL.
     *
     * @return string|null
     */
    public function getProfilePictureUrlAttribute()
    {
        if ($this->profile_picture) {
            return asset('storage/'.$this->profile_picture);
        }

        return null;
    }

    /**
     * Get the default profile picture URL.
     *
     * @return string
     */
    public function getDefaultProfilePictureAttribute()
    {
        // Generate a placeholder based on initials
        $initials = substr($this->name, 0, 1);

        return 'https://ui-avatars.com/api/?name='.urlencode($this->name).'&color=7F9CF5&background=EBF4FF';
    }

    /**
     * Get the profile picture URL or default.
     *
     * @return string
     */
    public function getProfilePictureOrDefaultAttribute()
    {
        return $this->profile_picture_url ?? $this->default_profile_picture;
    }
}
