<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Resource;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function dashboard()
    {
        // 1. DYNAMIC ANALYTICS CALCULATIONS

        // Calculate Total Revenue (Assuming a flat rate of 100 DH per confirmed slot for your demo)
        // Note: If you add a 'price' column to your resources later, change this to: ->sum('price')
        $totalRevenue = Reservation::where('status', 'confirmed')->count() * 100;

        // Count all currently active/confirmed bookings
        $activeBookings = Reservation::where('status', 'confirmed')->count();

        // Calculate Resource Occupancy Rate (%)
        // Formula: (Total active bookings / Total capacity of all resources) * 100
        $totalCapacity = Resource::sum('capacity') ?: 1; // Prevent division by zero if database is empty
        $occupancyRate = round(($activeBookings / $totalCapacity) * 100);
        if ($occupancyRate > 100) {
            $occupancyRate = 100;
        } // Cap at 100% maximum

        // 2. GLOBAL STATS (Combining your existing stats with the new insights)
        $stats = [
            'total_users' => User::count(),
            'pending_partners' => User::where('role', 'owner')->where('is_verified', false)->count(),
            'total_resources' => Resource::count(),

            // New UI Insights
            'formatted_revenue' => number_format($totalRevenue).' DH',
            'active_bookings' => $activeBookings,
            'occupancy_rate' => $occupancyRate.'%',
            'occupancy_percentage' => $occupancyRate, // Raw number passed for the Tailwind progress bar width
        ];

        // 3. PENDING PARTNERS TABLE (Kept exactly as you built it)
        $pendingPartners = User::where('role', 'owner')
            ->where('is_verified', false)
            ->latest()
            ->take(10)
            ->get();

        // 4. CHART DATA: Last 30 days of reservations (Kept exactly as you built it)
        $thirtyDaysAgo = Carbon::now()->subDays(30);

        $chartData = Reservation::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('count(*) as count')
        )
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->groupBy('date')
            ->orderBy('date', 'ASC')
            ->get();

        $formattedChartData = $chartData->map(function ($item) {
            return [
                'date' => Carbon::parse($item->date)->format('M d'),
                'reservations' => $item->count,
            ];
        });

        $recentActivity = Reservation::with(['user', 'resource'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($reservation) {
                return [
                    'id' => $reservation->id,
                    'client' => $reservation->user ? $reservation->user->name : 'Unknown User',
                    // Uses 'title' from your migration
                    'resource_title' => $reservation->resource ? $reservation->resource->title : 'Deleted Listing',
                    // Uses 'type' (car, hotel, pitch) from your migration
                    'resource_type' => $reservation->resource ? $reservation->resource->type : 'N/A',
                    'status' => $reservation->status,
                    'time' => $reservation->created_at->diffForHumans(),
                ];
            });

        // Send everything down to your React view
        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'pendingPartners' => $pendingPartners,
            'chartData' => $formattedChartData,
            'recentActivity' => $recentActivity,
        ]);

    }

    public function approvePartner(Request $request, User $user)
    {
        $user->update(['is_verified' => true]);

        return back()->with('success', 'Partner has been approved and can now create listings.');
    }
}
