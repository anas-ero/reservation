<?php

namespace App\Http\Controllers;

use App\Models\Resource;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminResourceController extends Controller
{
    public function index(Request $request)
    {
        $query = Resource::with('owner')->latest();
        if ($request->has('search')) {
            $query->where('title', 'like', '%'.$request->search.'%');
        }

        // Optional Filter by Type (car, hotel, pitch)
        if ($request->has('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        $resources = $query->latest()->get()->map(function ($resource) {
            return [
                'id' => $resource->id,
                'title' => $resource->title,
                'type' => $resource->type,
                'price' => number_format($resource->price, 2).' DH',
                'pricing_type' => $resource->pricing_type,
                'location' => $resource->location ?? 'N/A',
                'status' => $resource->status, // active, inactive
                'owner_name' => $resource->owner ? $resource->owner->name : 'Unknown Partner',
                'created_at' => $resource->created_at->format('M d, Y'),
            ];
        });

        return Inertia::render('Admin/Resources/Index', [
            'resources' => $resources,
            'filters' => $request->only('search', 'type'),
        ]);

    }

    public function toggleStatus(Resource $resource)
    {
        $newStatus = $resource->status === 'active' ? 'inactive' : 'active';
        $resource->update(['status' => $newStatus]);

        return redirect()->route('admin.resources')->with('success', 'Resource status updated successfully.');
    }
}
