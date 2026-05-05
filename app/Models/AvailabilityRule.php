<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AvailabilityRule extends Model
{
    protected $fillable = [
        'resource_id',
        'day_of_week',
        'start_time',
        'end_time',
    ];

    public function resource()
    {
        return $this->belongsTo(Resource::class);
    }
}
