<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResourceRoom extends Model
{
    use HasFactory;

    protected $fillable = [
        'resource_id',
        'room_type',
        'bed_type',
    ];

    public function resource()
    {
        return $this->belongsTo(Resource::class);
    }
}
