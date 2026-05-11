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
            'resources' => $resources
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
}