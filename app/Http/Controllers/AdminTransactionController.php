<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminTransactionController extends Controller
{
    public function index(Request $request)
    {
        // Query global reservations, eager-loading client and resource properties
        $query = Reservation::with(['user', 'resource']);

        // Filter by Status if requested
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $reservations = $query->latest()->get()->map(function ($reservation) {
            return [
                'id' => $reservation->id,
                'client_name' => $reservation->user ? $reservation->user->name : 'Unknown Client',
                'client_email' => $reservation->user ? $reservation->user->email : 'N/A',
                'resource_title' => $reservation->resource ? $reservation->resource->title : 'Deleted Listing',
                'resource_type' => $reservation->resource ? $reservation->resource->type : 'N/A',
                'price_raw' => $reservation->resource ? $reservation->resource->price : 0,
                'status' => $reservation->status, // pending, confirmed, cancelled
                'date' => $reservation->created_at->format('M d, Y • H:i'),
            ];
        });

        // Calculate specific operational counters for the sub-header metrics cards
        $totalSales = $query->clone()->where('status', 'confirmed')->get()->sum(function($r) {
            return $r->resource ? $r->resource->price : 0;
        });

        $transactionStats = [
            'gross_volume' => number_format($totalSales, 2) . ' DH',
            'total_count' => $reservations->count(),
            'pending_count' => $reservations->where('status', 'pending')->count(),
        ];

        return Inertia::render('Admin/Transactions/Index', [
            'reservations' => $reservations,
            'stats' => $transactionStats,
            'filters' => $request->only(['status'])
        ]);
    }
}