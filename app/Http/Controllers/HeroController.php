<?php

namespace App\Http\Controllers;

use App\Models\Resource;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HeroController extends Controller
{
    public function index(Request $request)
    {
        $query = Resource::query();

        // 2. If the user picked a category (and it's not "all"), filter the database
        if ($request->filled('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        // 3. Get the final filtered list
        $resources = $query->take(4)->get();

        return Inertia::render('Welcome', [
            'resources' => $resources,
            'currentFilters' => [
                'type' => $request->type ?? 'all',
            ],
            
        ]);
    }
}
