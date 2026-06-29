<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReservationController extends Controller
{
    

    public function store(Request $request)
    {
        // ✅ Validation
        $validated = $request->validate([
            'resource_id' => ['required', 'exists:resources,id'],
            'start_time' => ['required', 'date'],
            'end_time' => ['required', 'date', 'after:start_time'],
            'guests' => ['required', 'integer', 'min:1'],
        ]);

        

        // 🚨 Check overlap
        $conflict = Reservation::where('resource_id', $validated['resource_id'])
            ->where('status', '!=', 'cancelled')
            ->whereBetween('start_time', [$validated['start_time'], $validated['end_time']])
            ->orWhere(function ($query) use ($validated) {
                $query->where('resource_id', $validated['resource_id'])
                    ->where('status', '!=', 'cancelled')
                    ->whereBetween('end_time', [$validated['start_time'], $validated['end_time']]);
            })
            ->exists();

        if ($conflict) {
            return back()->withErrors([
                'error' => 'This time is already booked',
            ]);
        }

        $resource = \App\Models\Resource::findOrFail($validated['resource_id']);
        $start = \Carbon\Carbon::parse($validated['start_time']);
        $end = \Carbon\Carbon::parse($validated['end_time']);
        
        $totalPrice = 0;
        if ($resource->pricing_type === 'hourly') {
            $hours = max(1, $start->diffInHours($end));
            $totalPrice = $hours * $resource->price;
        } else {
            // daily or nightly
            $days = max(1, $start->diffInDays($end));
            // if same day booking (less than 24h) we count at least 1 day
            if ($days == 0) $days = 1;
            $totalPrice = $days * $resource->price;
        }

        // ✅ Create reservation
        Reservation::create([
            'user_id' => auth()->id(),
            'resource_id' => $validated['resource_id'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'guests' => $validated['guests'],
            'total_price' => $totalPrice,
            'status' => 'confirmed',
        ]);

        return back()->with('success', 'Reservation created');
    }

    public function cancel(Reservation $reservation)
    {
        // Check ownership
        if ($reservation->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        // Check if can be cancelled
        if (in_array($reservation->status, ['pending', 'confirmed'])) {
            $reservation->update(['status' => 'cancelled']);
            return back()->with('success', 'Reservation cancelled successfully.');
        }

        return back()->withErrors(['error' => 'Reservation cannot be cancelled.']);
    }
}
