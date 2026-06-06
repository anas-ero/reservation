<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Reservation;
use App\Models\ResourceImage;
use App\Models\ResourceMeta;
use App\Models\AvailabilityRule;
use App\Models\Unavailability;
use App\Models\Review;
use App\Models\Rating;
use App\Models\ResourceRoom;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Resource extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'description',
        'type',
        'owner_id',
        'price',
        'pricing_type',
        'location',
        'lat',
        'lng',
        'status',
        'max_guests',
        'exclude_infants',
        'bathrooms',
        'beds',
        'bedrooms',
        'other_rooms',
        'allows_children',
    ];

    // owner 
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
    // Reservation
    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
    // Images
    public function images()
    {
        return $this->hasMany(ResourceImage::class);
    }
    // Metadata
    public function metadata()
    {
        return $this->hasMany(ResourceMeta::class);
    }
    // Rooms
    public function rooms()
    {
        return $this->hasMany(ResourceRoom::class);
    }
    // Availability rules
    public function availabilityRules()
    {
        return $this->hasMany(AvailabilityRule::class);
    }
    // Blocked dates
    public function unavailabilities()
    {
        return $this->hasMany(Unavailability::class);
    }
    // Reviews
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
    // Ratings
    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }

}
