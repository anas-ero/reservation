<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Inertia\Inertia;

class OwnerController extends Controller
{
    public function dashboard(Request $request)
    {
        $user = $request->user();

        $pending_bookings = \App\Models\Reservation::whereHas('resource', function($query) use ($user) {
            $query->where('owner_id', $user->id);
        })->where('status', 'pending')->count();

        $monthly_revenue = \App\Models\Reservation::whereHas('resource', function($query) use ($user) {
            $query->where('owner_id', $user->id);
        })->where('status', 'confirmed')->whereMonth('created_at', now()->month)->sum('total_price') ?? 0;

        $total_bookings = \App\Models\Reservation::whereHas('resource', function($query) use ($user) {
            $query->where('owner_id', $user->id);
        })->where('status', 'confirmed')->count();

        // 1. Calculate Quick Stats
        $stats = [
            'total_resources' => $user->resources()->count(),
            'active_resources' => $user->resources()->where('is_active', true)->count(),
            'pending_bookings' => $pending_bookings, 
            'monthly_revenue' => number_format($monthly_revenue, 2),
            'total_bookings' => $total_bookings,
        ];

        // Chart Data (Last 30 days)
        $thirtyDaysAgo = Carbon::now()->subDays(30);
        $chartData = \App\Models\Reservation::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('count(*) as count')
        )
            ->whereHas('resource', function($query) use ($user) {
                $query->where('owner_id', $user->id);
            })
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->groupBy('date')
            ->orderBy('date', 'ASC')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => Carbon::parse($item->date)->format('M d'),
                    'reservations' => $item->count,
                ];
            });

        // Recent Bookings Feed
        $recentBookings = \App\Models\Reservation::with(['user', 'resource'])
            ->whereHas('resource', function($query) use ($user) {
                $query->where('owner_id', $user->id);
            })
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'client' => $booking->user ? $booking->user->name : 'Unknown User',
                    'resource_title' => $booking->resource ? $booking->resource->title : 'Deleted Listing',
                    'status' => $booking->status,
                    'time' => $booking->created_at->diffForHumans(),
                    'total_price' => number_format($booking->total_price, 2),
                ];
            });

        // 2. Fetch their 5 most recently added resources for the preview table
        $recentResources = $user->resources()
                                ->latest()
                                ->take(5)
                                ->get();

        // Pass it all to React
        return Inertia::render('OwnerDashboard', [
            'stats' => $stats,
            'recentResources' => $recentResources,
            'chartData' => $chartData,
            'recentBookings' => $recentBookings,
        ]);
    }
}