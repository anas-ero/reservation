<?php

use Illuminate\Http\Request;
use App\Models\Listing;
use App\Models\Resource;
use Illuminate\Support\Facades\Route;

Route::get('/resources', function (Request $request) {

    $query = Resource::query();

    // Filter by type
    if ($request->type) {
        $query->where('type', $request->type);
    }

    // Filter by location
    if ($request->location) {
        $query->where(
            'location',
            'LIKE',
            '%' . $request->location . '%'
        );
    }

    // Filter by max price
    if ($request->max_price) {
        $query->where(
            'price',
            '<=',
            $request->max_price
        );
    }

    // Filter by pricing type
    if ($request->pricing_type) {
        $query->where(
            'pricing_type',
            $request->pricing_type
        );
    }

    return response()->json(
        $query->get()
    );
});