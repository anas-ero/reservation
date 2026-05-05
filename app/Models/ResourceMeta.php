<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ResourceMeta extends Model
{
    use HasFactory;

    protected $table = 'resource_meta'; 

    protected $fillable = [
        'resource_id',
        'key',
        'value'
    ];

    public function resource()
    {
        return $this->belongsTo(Resource::class);
    }
}