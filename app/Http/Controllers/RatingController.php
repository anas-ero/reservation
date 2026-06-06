<?php

namespace App\Http\Controllers;

use App\Models\Resource;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RatingController extends Controller
{

    public function index(Resource $resource)
    {
        $ratings = $resource->ratings()->with('user')->latest()->get();

        return Inertia::render('ResourcesPage/Show', [
            'resource' => $resource,
            'ratings' => $ratings,
        ]);
    }
    public function store(Request $request, Resource $resource)
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $resource->ratings()->create([
            'user_id' => $request->user()->id,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
        ]);

        return back()->with('success', 'Your rating has been submitted successfully.');
    }

}
