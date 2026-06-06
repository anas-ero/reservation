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
            ->whereBetween('start_time', [$validated['start_time'], $validated['end_time']])
            ->orWhere(function ($query) use ($validated) {
                $query->where('resource_id', $validated['resource_id'])
                    ->whereBetween('end_time', [$validated['start_time'], $validated['end_time']]);
            })
            ->exists();

        if ($conflict) {
            return back()->withErrors([
                'error' => 'This time is already booked',
            ]);
        }

        // ✅ Create reservation
        Reservation::create([
            'user_id' => auth()->id(),
            'resource_id' => $validated['resource_id'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'guests' => $validated['guests'],
            'status' => 'confirmed',
        ]);

        return back()->with('success', 'Reservation created');
    }
}
