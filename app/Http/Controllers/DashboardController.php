<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        if ($user->role === 'admin') {
            return redirect()->route('admin.dashboard');
        } elseif ($user->role === 'owner') {
            if (!$user->is_verified) {
                return redirect()->route('partner.pending');
            }
            return redirect()->route('owner.dashboard');
        }

        // 1. Fetch current active or pending bookings
        $upcomingBookings = Reservation::with('resource')
            ->where('user_id', $user->id)
            ->whereIn('status', ['pending', 'confirmed'])
            ->orderBy('start_time')
            ->latest()
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'reference' => '#BKG-'.str_pad($booking->id, 4, '0', STR_PAD_LEFT), // e.g., #BKG-0012
                    'resource_id' => $booking->resource ? $booking->resource->id : null,
                    'title' => $booking->resource ? $booking->resource->title : 'Listing Name',
                    'type' => $booking->resource ? $booking->resource->type : 'N/A',
                    'price' => number_format($booking->resource ? $booking->resource->price : 0, 2),
                    'status' => $booking->status,
                    'date' => Carbon::parse($booking->created_at)->format('M d, Y'),
                    'start_date' => Carbon::parse($booking->start_time)->format('M d, Y'),
                    'end_date' => Carbon::parse($booking->end_time)->format('M d, Y'),
                    'total_price' => number_format($booking->total_price, 2),
                ];
            });

        // 2. Fetch past or cancelled history (with filters & pagination)
        $typeFilter = request('type');
        $pastBookingsQuery = Reservation::with('resource')
            ->where('user_id', $user->id)
            ->whereIn('status', ['cancelled', 'completed']);
        
        if ($typeFilter && $typeFilter !== 'all') {
            $pastBookingsQuery->whereHas('resource', function ($q) use ($typeFilter) {
                $q->where('type', $typeFilter);
            });
        }

        $pastBookings = $pastBookingsQuery
            ->orderBy('start_time', 'desc')
            ->paginate(5)
            ->withQueryString()
            ->through(function ($booking) {
                return [
                    'id' => $booking->id,
                    'reference' => '#BKG-'.str_pad($booking->id, 4, '0', STR_PAD_LEFT), // e.g., #BKG-0012
                    'resource_id' => $booking->resource ? $booking->resource->id : null,
                    'title' => $booking->resource ? $booking->resource->title : 'Listing Name',
                    'type' => $booking->resource ? $booking->resource->type : 'N/A',
                    'price' => number_format($booking->resource ? $booking->resource->price : 0, 2),
                    'status' => $booking->status,
                    'date' => Carbon::parse($booking->created_at)->format('M d, Y'),
                    'start_date' => Carbon::parse($booking->start_time)->format('M d, Y'),
                    'end_date' => Carbon::parse($booking->end_time)->format('M d, Y'),
                    'total_price' => number_format($booking->total_price, 2),
                ];
            });

        // 3. Simple quick summaries for metrics
        $customerStats = [
            'active_count' => $upcomingBookings->count(),
            'total_spent' => number_format(Reservation::where('user_id', $user->id)
                ->where('status', 'completed')
                ->sum('total_price'), 2).' DH',
        ];

        // 4. Fetch favorites
        $favorites = $user->favorites()->with('resource')->get()->map(function ($fav) {
            return [
                'id' => $fav->id,
                'resource_id' => $fav->resource->id,
                'title' => $fav->resource->title,
                'type' => $fav->resource->type,
                'price' => number_format($fav->resource->price, 2),
            ];
        });

        return Inertia::render('CustomerDashboard', [
            'upcomingBookings' => $upcomingBookings,
            'pastBookings' => $pastBookings,
            'stats' => $customerStats,
            'favorites' => $favorites,
            'filters' => ['type' => $typeFilter],
        ]);
    }
}
