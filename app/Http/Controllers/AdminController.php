<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Resource;
use App\Models\Reservation; // Make sure to import this!
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function dashboard()
    {
        // 1. Global stats
        $stats = [
            'total_users' => User::count(),
            'pending_partners' => User::where('role', 'owner')->where('is_verified', false)->count(),
            'total_resources' => Resource::count(),
        ];

        // 2. Pending partners table
        $pendingPartners = User::where('role', 'owner')
            ->where('is_verified', false)
            ->latest()
            ->take(10)
            ->get();

        // 3. CHART DATA: Last 30 days of reservations
        $thirtyDaysAgo = Carbon::now()->subDays(30);
        
        // Group reservations by date
        $chartData = Reservation::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('count(*) as count')
            )
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->groupBy('date')
            ->orderBy('date', 'ASC')
            ->get();

        // Format the data so the React chart can read it easily
        $formattedChartData = $chartData->map(function ($item) {
            return [
                'date' => Carbon::parse($item->date)->format('M d'),
                'reservations' => $item->count,
            ];
        });

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'pendingPartners' => $pendingPartners,
            'chartData' => $formattedChartData // Pass it to React
        ]);
    }
    public function approvePartner(Request $request, User $user)
        {
            // Flip the boolean
            $user->update(['is_verified' => true]);

            // Optional: Send them an email
            // Mail::to($user->email)->send(new PartnerApprovedMail());

            return back()->with('success', 'Partner has been approved and can now create listings.');
        }
}