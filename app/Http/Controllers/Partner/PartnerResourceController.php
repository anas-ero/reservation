<?php

namespace App\Http\Controllers\Partner;

use App\Http\Controllers\Controller;
use App\Models\Resource;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PartnerResourceController extends Controller
{
    // 1. Show all listings owned by this specific partner
    public function index(Request $request)
    {
        // Only fetch resources that belong to the logged-in owner
        $resources = $request->user()->resources()->latest()->get();

        return Inertia::render('Partner/Resources/Index', [
            'resources' => $resources,
        ]);
    }

    // 2. Show the "Create a new Listing" form
    public function create()
    {
        return Inertia::render('Partner/Resources/Create');
    }

    // 3. Save the new listing to the database
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'type' => 'required|string|in:villa,car,sports_pitch', // Limits the options
            'price' => 'required|numeric|min:0',
            'location' => 'required|string|max:255',
        ]);

        // Securely create the resource attached to the logged-in user
        $request->user()->resources()->create($validated);

        return redirect()->route('partner.resources.index')->with('success', 'Listing created successfully!');
    }

    public function show(Request $request, $id)
    {
        $resource = Resource::findOrFail($id);

        if ($resource->user_id != null && $resource->user_id != $request->user()->id) {
            abort(403, 'Unauthorized access to this resource.');
        }

        // 🔥 USE THE REAL DATABASE VIEWS HERE:
        $analytics = [
            'total_views' => $resource->views, 
            'this_week_views' => 0, // We will build a complex timeline for this later
            'conversion_rate' => '0%', 
        ];

        $mockBookings = [
            ['id' => 1, 'customer' => 'Youssef Alaoui', 'date' => '2026-05-20', 'status' => 'confirmed', 'amount' => $resource->price * 2],
            ['id' => 2, 'customer' => 'Fatima Zahra', 'date' => '2026-05-25', 'status' => 'pending', 'amount' => $resource->price],
        ];

        $mockReviews = [
            ['id' => 1, 'author' => 'Karim B.', 'rating' => 5, 'comment' => 'Absolutely amazing experience, highly recommend!', 'date' => '2 days ago'],
            ['id' => 2, 'author' => 'Sarah M.', 'rating' => 4, 'comment' => 'Great place, but finding parking was a bit tricky.', 'date' => '1 week ago'],
        ];

        return Inertia::render('Partner/Resources/Show', [
            'resource' => $resource,
            'analytics' => $analytics,
            'bookings' => $mockBookings,
            'reviews' => $mockReviews,
        ]);
    }

    // 5. Delete the resource
    public function destroy(Request $request, $id) 
    {
        $resource = Resource::findOrFail($id);

        // Relaxed security check to allow deleting older test data
        if ($resource->user_id != null && $resource->user_id != $request->user()->id) {
            abort(403, 'Unauthorized action.');
        }

        $resource->delete();

        return redirect()->route('partner.resources.index')->with('success', 'Listing deleted successfully.');
    }
}
