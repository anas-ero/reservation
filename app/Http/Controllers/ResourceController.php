<?php

namespace App\Http\Controllers;

use App\Models\Resource;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class ResourceController extends Controller
{
    public function index(Request $request)
    {
        $query = Resource::query();

        // 🔁 Map frontend types → DB types
        $typeMap = [
            'stays' => 'hotel',
            'cars' => 'car',
            'sports' => 'pitch',
            'workspaces' => 'workspace',
        ];

        // ✅ Filter by type
        if ($request->type) {
            $query->where('type', $typeMap[$request->type]);
        }

        // ✅ Filter by location
        if ($request->location) {
            $query->where('location', 'like', '%' . $request->location . '%');
        }

        // ✅ Date range availability (hotels, cars)
        if ($request->start_date && $request->end_date) {
            $start = Carbon::parse($request->start_date);
            $end = Carbon::parse($request->end_date);

            $query->whereDoesntHave('reservations', function ($q) use ($start, $end) {
                $q->where('start_time', '<', $end)
                  ->where('end_time', '>', $start);
            });
        }

        // ✅ Single date + time (sports)
        if ($request->date && $request->time) {
            $start = Carbon::parse($request->date . ' ' . $request->time);
            $end = (clone $start)->addHour();

            $query->whereDoesntHave('reservations', function ($q) use ($start, $end) {
                $q->where('start_time', '<', $end)
                  ->where('end_time', '>', $start);
            });
        }

        // ✅ Load relations
        $resources = $query->with('images')->paginate(10)->withQueryString();

        return Inertia::render('Resources/Index', [
            'resources' => $resources,
            'filters' => $request->only([
                'type',
                'location',
                'start_date',
                'end_date',
                'date',
                'time'
            ]),
        ]);
    }

    public function show(Resource $resource)
    {
        // 1. Add +1 to the views every time this page loads!
        $resource->increment('views');

        // 2. Return the public view to the customer
        return Inertia::render('Resources/Show', [
            'resource' => $resource
        ]);
    }
}