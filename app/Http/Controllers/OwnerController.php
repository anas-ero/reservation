<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class OwnerController extends Controller
{
    public function dashboard(Request $request)
    {
        $user = $request->user();

        // 1. Calculate Quick Stats
        $stats = [
            'total_resources' => $user->resources()->count(),
            'active_resources' => $user->resources()->where('is_active', true)->count(),
            // We will hook these up later when we build the Booking system!
            'pending_bookings' => 0, 
            'monthly_revenue' => 0, 
        ];

        // 2. Fetch their 5 most recently added resources for the preview table
        $recentResources = $user->resources()
                                ->latest()
                                ->take(5)
                                ->get();

        // Pass it all to React
        return Inertia::render('OwnerDashboard', [
            'stats' => $stats,
            'recentResources' => $recentResources
        ]);
    }
}