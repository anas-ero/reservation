<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // 1. Fetch current active or pending bookings
        $upcomingBookings = Reservation::with('resource')
            ->where('user_id', $user->id)
            ->whereIn('status', ['pending', 'confirmed'])
            ->latest()
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'title' => $booking->resource ? $booking->resource->title : 'Listing Name',
                    'type' => $booking->resource ? $booking->resource->type : 'N/A',
                    'price' => number_format($booking->total_price ?? ($booking->resource ? $booking->resource->price : 0), 2) . ' DH',
                    'status' => $booking->status,
                    'date' => $booking->start_time->format('M d') . ' - ' . $booking->end_time->format('M d, Y'),
                ];
            });

        // 2. Fetch past or cancelled history
        $pastBookings = Reservation::with('resource')
            ->where('user_id', $user->id)
            ->whereIn('status', ['cancelled', 'completed'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'title' => $booking->resource ? $booking->resource->title : 'Listing Name',
                    'type' => $booking->resource ? $booking->resource->type : 'N/A',
                    'price' => number_format($booking->total_price ?? ($booking->resource ? $booking->resource->price : 0), 2) . ' DH',
                    'status' => $booking->status,
                    'date' => $booking->start_time->format('M d') . ' - ' . $booking->end_time->format('M d, Y'),
                ];
            });

        // 3. Simple quick summaries for metrics
        $customerStats = [
            'active_count' => $upcomingBookings->count(),
            'total_spent' => number_format(Reservation::where('user_id', $user->id)
                ->where('status', 'confirmed')
                ->sum('total_price'), 2) . ' DH'
        ];

        return Inertia::render('CustomerDashboard', [
            'upcomingBookings' => $upcomingBookings,
            'pastBookings' => $pastBookings,
            'stats' => $customerStats,
        ]);
    }
}