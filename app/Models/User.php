<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Models\Reservation;
use App\Models\Resource;
use App\Models\Review;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class User extends Authenticatable
{
    use HasFactory;
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'avatar',
        'is_verified',
        'business_name',
        'cin_or_rc',
        'phone_number',
    ];

    //    Reservation made by a user
    public function reservations()
    {
        return $this->hasMany(Reservation::class);

    }
    //  resources owned by the user
    public function resources() {
        return $this->hasMany(Resource::class, 'owner_id');
    }
    // reviews written by the user
    public function reviews() {
        return $this->hasMany(Review::class);
    }

}
