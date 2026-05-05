<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResourceImage extends Model
{
    protected $fillable = [
        'resource_id',
        'image_path',
        'is_primary',
    ];

    public function resource()
    {
        return $this->belongsTo(Resource::class);
    }
}
