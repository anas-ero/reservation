<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Unavailability extends Model
{
    protected $fillable = [
        'resource_id',
        'start_time',
        'end_time',
        'reason',
    ];

    public function resource()
    {
        return $this->belongsTo(Resource::class);
    }
}
